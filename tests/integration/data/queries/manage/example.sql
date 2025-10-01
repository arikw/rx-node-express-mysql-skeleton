START TRANSACTION;

INSERT INTO items SET
  `uid` = 'abcdef123456';

INSERT INTO item_translations SET
    `language_code` = 'en',
    `country_code` = 'US',
    `item_uid` = 'abcdef123456';

INSERT INTO item_translations SET
    `language_code` = 'he',
    `country_code` = 'IL',
    `item_uid` = 'abcdef123456';

COMMIT;