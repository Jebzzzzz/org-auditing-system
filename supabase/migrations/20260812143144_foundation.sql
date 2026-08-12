-- OrgAudit approved schema foundation
-- PostgreSQL / Supabase migration
--
-- Apply as the first database migration in supabase/migrations/.
-- This file creates the approved schema, relationships, constraints, and
-- voucher allocator. It deliberately does NOT grant browser table mutations.
-- Apply the companion RLS/RPC security migration before connecting the app.

create extension if not exists pgcrypto;

create schema if not exists private;
revoke all on schema private from public;

create type public.organization_status as enum ('active', 'inactive');
create type public.position_role as enum ('treasurer', 'auditor', 'president');
create type public.semester_type as enum ('first_semester', 'second_semester');
create type public.period_status as enum ('open', 'closed', 'archived');
create type public.transaction_type as enum ('income', 'expense');
create type public.fund_source as enum ('bank', 'cash_on_hand');
create type public.financial_status as enum ('posted', 'voided');
create type public.handover_status as enum (
  'pending', 'approved', 'completed', 'rejected', 'cancelled'
);

create table public.faculties (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.departments (
  id uuid primary key default gen_random_uuid(),
  faculty_id uuid not null references public.faculties(id) on delete restrict,
  code text not null unique,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (faculty_id, name)
);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  department_id uuid not null references public.departments(id) on delete restrict,
  name text not null,
  status public.organization_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (department_id, name)
);

-- A profile identifies a human being. It is separate from reusable position login accounts.
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.system_admins (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id) on delete restrict,
  profile_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.academic_periods (
  id uuid primary key default gen_random_uuid(),
  academic_year text not null check (academic_year ~ '^[0-9]{4}-[0-9]{4}$'),
  semester public.semester_type not null,
  start_date date,
  end_date date,
  status public.period_status not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date is null or start_date is null or end_date >= start_date),
  unique (academic_year, semester)
);

-- The reusable Supabase Auth account belongs to this position.
create table public.positions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  role public.position_role not null,
  auth_user_id uuid not null unique references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, role),
  unique (id, organization_id)
);

create table public.position_holders (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  position_id uuid not null,
  profile_id uuid not null references public.profiles(id) on delete restrict,
  start_date date not null,
  end_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date is null or end_date >= start_date),
  foreign key (position_id, organization_id)
    references public.positions(id, organization_id) on delete restrict,
  unique (id, organization_id),
  unique (id, position_id)
);

-- A person cannot hold two active positions. A position cannot have two active holders.
create unique index position_holders_one_active_position_per_profile
  on public.position_holders (profile_id)
  where end_date is null;

create unique index position_holders_one_active_holder_per_position
  on public.position_holders (position_id)
  where end_date is null;

create table public.handover_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  position_id uuid not null,
  outgoing_holder_id uuid not null,
  incoming_profile_id uuid not null references public.profiles(id) on delete restrict,
  initiated_by_position_holder_id uuid not null,
  status public.handover_status not null default 'pending',
  reason text,
  reviewed_by_system_admin_id uuid references public.system_admins(id) on delete restrict,
  initiated_at timestamptz not null default now(),
  reviewed_at timestamptz,
  completed_at timestamptz,
  check (
    (status = 'completed' and completed_at is not null)
    or (status <> 'completed')
  ),
  foreign key (position_id, organization_id)
    references public.positions(id, organization_id) on delete restrict,
  foreign key (outgoing_holder_id, organization_id)
    references public.position_holders(id, organization_id) on delete restrict,
  foreign key (initiated_by_position_holder_id, organization_id)
    references public.position_holders(id, organization_id) on delete restrict
);

create table public.period_opening_balances (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  academic_period_id uuid not null references public.academic_periods(id) on delete restrict,
  bank_balance numeric(14,2) not null check (bank_balance >= 0),
  cash_on_hand_balance numeric(14,2) not null check (cash_on_hand_balance >= 0),
  entered_by_position_holder_id uuid not null,
  updated_by_position_holder_id uuid,
  update_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    updated_by_position_holder_id is null
    or update_reason is not null
  ),
  foreign key (entered_by_position_holder_id, organization_id)
    references public.position_holders(id, organization_id) on delete restrict,
  foreign key (updated_by_position_holder_id, organization_id)
    references public.position_holders(id, organization_id) on delete restrict,
  unique (organization_id, academic_period_id),
  unique (id, organization_id)
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, organization_id)
);

create unique index categories_unique_normalized_name_idx
  on public.categories (organization_id, lower(name));

create table public.events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  academic_period_id uuid not null references public.academic_periods(id) on delete restrict,
  title text not null,
  start_date date not null,
  end_date date,
  created_by_position_holder_id uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date is null or end_date >= start_date),
  foreign key (created_by_position_holder_id, organization_id)
    references public.position_holders(id, organization_id) on delete restrict,
  unique (id, organization_id)
);

-- This table is locked by private.allocate_voucher().
create table public.voucher_sequences (
  organization_id uuid not null references public.organizations(id) on delete restrict,
  academic_year text not null check (academic_year ~ '^[0-9]{4}-[0-9]{4}$'),
  last_number integer not null default 0 check (last_number >= 0),
  primary key (organization_id, academic_year)
);

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  academic_period_id uuid not null references public.academic_periods(id) on delete restrict,
  event_id uuid,
  category_id uuid,
  created_by_position_holder_id uuid not null,
  transaction_date date not null,
  voucher_sequence integer not null check (voucher_sequence > 0),
  voucher_number text not null,
  transaction_type public.transaction_type not null,
  fund_source public.fund_source not null,
  reference text not null check (length(trim(reference)) > 0),
  item_details text not null check (length(trim(item_details)) > 0),
  quantity numeric(14,2),
  unit_price numeric(14,2),
  amount numeric(14,2) not null check (amount > 0),
  description text,
  status public.financial_status not null default 'posted',
  voided_at timestamptz,
  voided_by_position_holder_id uuid,
  void_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (quantity is null and unit_price is null)
    or (quantity is not null and unit_price is not null
      and quantity > 0 and unit_price >= 0)
  ),
  check (quantity is null or amount = quantity * unit_price),
  check (
    (status = 'posted'
      and voided_at is null
      and voided_by_position_holder_id is null
      and void_reason is null)
    or
    (status = 'voided'
      and voided_at is not null
      and voided_by_position_holder_id is not null
      and length(trim(void_reason)) > 0)
  ),
  foreign key (event_id, organization_id)
    references public.events(id, organization_id) on delete restrict,
  foreign key (category_id, organization_id)
    references public.categories(id, organization_id) on delete restrict,
  foreign key (created_by_position_holder_id, organization_id)
    references public.position_holders(id, organization_id) on delete restrict,
  foreign key (voided_by_position_holder_id, organization_id)
    references public.position_holders(id, organization_id) on delete restrict,
  unique (organization_id, voucher_number),
  unique (id, organization_id)
);

create table public.transaction_revisions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  transaction_id uuid not null,
  revision_number integer not null check (revision_number > 0),
  changed_by_position_holder_id uuid not null,
  change_reason text not null check (length(trim(change_reason)) > 0),
  before_data jsonb not null,
  after_data jsonb not null,
  changed_at timestamptz not null default now(),
  foreign key (transaction_id, organization_id)
    references public.transactions(id, organization_id) on delete restrict,
  foreign key (changed_by_position_holder_id, organization_id)
    references public.position_holders(id, organization_id) on delete restrict,
  unique (transaction_id, revision_number)
);

create table public.fund_transfers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  academic_period_id uuid not null references public.academic_periods(id) on delete restrict,
  from_fund_source public.fund_source not null,
  to_fund_source public.fund_source not null,
  amount numeric(14,2) not null check (amount > 0),
  transfer_date date not null,
  reference text not null check (length(trim(reference)) > 0),
  description text,
  created_by_position_holder_id uuid not null,
  status public.financial_status not null default 'posted',
  voided_at timestamptz,
  voided_by_position_holder_id uuid,
  void_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (from_fund_source <> to_fund_source),
  check (
    (status = 'posted'
      and voided_at is null
      and voided_by_position_holder_id is null
      and void_reason is null)
    or
    (status = 'voided'
      and voided_at is not null
      and voided_by_position_holder_id is not null
      and length(trim(void_reason)) > 0)
  ),
  foreign key (created_by_position_holder_id, organization_id)
    references public.position_holders(id, organization_id) on delete restrict,
  foreign key (voided_by_position_holder_id, organization_id)
    references public.position_holders(id, organization_id) on delete restrict,
  unique (id, organization_id)
);

create table public.attachment_c_reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  academic_period_id uuid not null references public.academic_periods(id) on delete restrict,
  created_by_position_holder_id uuid not null,
  current_version_id uuid,
  created_at timestamptz not null default now(),
  foreign key (created_by_position_holder_id, organization_id)
    references public.position_holders(id, organization_id) on delete restrict,
  unique (organization_id, academic_period_id),
  unique (id, organization_id)
);

create table public.attachment_c_report_versions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  report_id uuid not null,
  version_number integer not null check (version_number > 0),
  supersedes_version_id uuid,
  snapshot_data jsonb not null,
  source_hash text not null check (length(trim(source_hash)) > 0),
  pdf_path text,
  generated_by_position_holder_id uuid not null,
  generated_at timestamptz not null default now(),
  foreign key (report_id, organization_id)
    references public.attachment_c_reports(id, organization_id) on delete restrict,
  foreign key (generated_by_position_holder_id, organization_id)
    references public.position_holders(id, organization_id) on delete restrict,
  unique (report_id, version_number),
  unique (id, report_id),
  unique (id, organization_id)
);

alter table public.attachment_c_report_versions
  add constraint attachment_c_report_versions_supersedes_fk
  foreign key (supersedes_version_id, report_id)
  references public.attachment_c_report_versions(id, report_id)
  on delete restrict;

alter table public.attachment_c_reports
  add constraint attachment_c_reports_current_version_fk
  foreign key (current_version_id, organization_id)
  references public.attachment_c_report_versions(id, organization_id)
  on delete restrict;

create table public.attachment_c_report_signatures (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  report_version_id uuid not null,
  position_holder_id uuid not null,
  position_id uuid not null,
  role public.position_role not null,
  signed_at timestamptz not null default now(),
  foreign key (report_version_id, organization_id)
    references public.attachment_c_report_versions(id, organization_id) on delete restrict,
  foreign key (position_holder_id, organization_id)
    references public.position_holders(id, organization_id) on delete restrict,
  foreign key (position_holder_id, position_id)
    references public.position_holders(id, position_id) on delete restrict,
  foreign key (position_id, organization_id)
    references public.positions(id, organization_id) on delete restrict,
  unique (report_version_id, role)
);

create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete restrict,
  actor_position_holder_id uuid,
  actor_system_admin_id uuid references public.system_admins(id) on delete restrict,
  entity_type text not null check (length(trim(entity_type)) > 0),
  entity_id uuid not null,
  action text not null check (length(trim(action)) > 0),
  reason text,
  before_data jsonb,
  after_data jsonb,
  request_id uuid,
  created_at timestamptz not null default now(),
  check (
    actor_position_holder_id is not null
    or actor_system_admin_id is not null
  ),
  foreign key (actor_position_holder_id, organization_id)
    references public.position_holders(id, organization_id) on delete restrict
);

-- Timestamp trigger used only for mutable source records.
create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger faculties_set_updated_at
before update on public.faculties
for each row execute function private.set_updated_at();

create trigger departments_set_updated_at
before update on public.departments
for each row execute function private.set_updated_at();

create trigger organizations_set_updated_at
before update on public.organizations
for each row execute function private.set_updated_at();

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function private.set_updated_at();

create trigger academic_periods_set_updated_at
before update on public.academic_periods
for each row execute function private.set_updated_at();

create trigger positions_set_updated_at
before update on public.positions
for each row execute function private.set_updated_at();

create trigger position_holders_set_updated_at
before update on public.position_holders
for each row execute function private.set_updated_at();

create trigger opening_balances_set_updated_at
before update on public.period_opening_balances
for each row execute function private.set_updated_at();

create trigger categories_set_updated_at
before update on public.categories
for each row execute function private.set_updated_at();

create trigger events_set_updated_at
before update on public.events
for each row execute function private.set_updated_at();

create trigger transactions_set_updated_at
before update on public.transactions
for each row execute function private.set_updated_at();

create trigger transfers_set_updated_at
before update on public.fund_transfers
for each row execute function private.set_updated_at();

-- Atomic voucher allocation. Only an approved financial mutation RPC calls this.
create or replace function private.allocate_voucher(
  p_organization_id uuid,
  p_academic_year text
)
returns table (voucher_sequence integer, voucher_number text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_next_number integer;
begin
  if p_academic_year !~ '^[0-9]{4}-[0-9]{4}$' then
    raise exception 'Invalid academic year.';
  end if;

  insert into public.voucher_sequences (organization_id, academic_year, last_number)
  values (p_organization_id, p_academic_year, 1)
  on conflict (organization_id, academic_year)
  do update set last_number = public.voucher_sequences.last_number + 1
  returning last_number into v_next_number;

  return query
  select v_next_number, p_academic_year || '-' || lpad(v_next_number::text, 4, '0');
end;
$$;

revoke all on function private.set_updated_at() from public;
revoke all on function private.allocate_voucher(uuid, text) from public;

-- Default-deny posture for the hosted Supabase project. The next migration adds
-- the approved policies and controlled RPCs; until then browser roles get no rows.
alter table public.faculties enable row level security;
alter table public.departments enable row level security;
alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.system_admins enable row level security;
alter table public.academic_periods enable row level security;
alter table public.positions enable row level security;
alter table public.position_holders enable row level security;
alter table public.handover_requests enable row level security;
alter table public.period_opening_balances enable row level security;
alter table public.categories enable row level security;
alter table public.events enable row level security;
alter table public.voucher_sequences enable row level security;
alter table public.transactions enable row level security;
alter table public.transaction_revisions enable row level security;
alter table public.fund_transfers enable row level security;
alter table public.attachment_c_reports enable row level security;
alter table public.attachment_c_report_versions enable row level security;
alter table public.attachment_c_report_signatures enable row level security;
alter table public.audit_log enable row level security;

-- Query indexes.
create index transactions_organization_period_date_idx
  on public.transactions (organization_id, academic_period_id, transaction_date desc);

create index transactions_event_idx
  on public.transactions (event_id)
  where event_id is not null;

create index transactions_category_idx
  on public.transactions (category_id)
  where category_id is not null;

create index transaction_revisions_transaction_idx
  on public.transaction_revisions (transaction_id, revision_number desc);

create index fund_transfers_organization_period_date_idx
  on public.fund_transfers (organization_id, academic_period_id, transfer_date desc);

create index events_organization_period_idx
  on public.events (organization_id, academic_period_id, start_date);

create index audit_log_organization_entity_idx
  on public.audit_log (organization_id, entity_type, entity_id, created_at desc);

-- Required next migration:
-- 1. Enable RLS on every public table.
-- 2. Add private identity helpers and grants.
-- 3. Add controlled financial/report/turnover RPCs.
-- 4. Add append-only/role-validation triggers.
-- 5. Add private Attachment C Storage bucket policies.
