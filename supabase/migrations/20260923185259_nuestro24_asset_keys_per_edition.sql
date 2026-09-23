alter table private.nuestro24_assets
  drop constraint if exists nuestro24_assets_pkey;

alter table private.nuestro24_assets
  add constraint nuestro24_assets_pkey
  primary key (edition_date, asset_key);

drop index if exists private.nuestro24_assets_edition_date_idx;
