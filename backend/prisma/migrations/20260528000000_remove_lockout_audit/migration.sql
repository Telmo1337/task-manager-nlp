-- Drop LoginAttempt and SecurityLog tables; remove lockout columns from User
DROP TABLE IF EXISTS `LoginAttempt`;
DROP TABLE IF EXISTS `SecurityLog`;
ALTER TABLE `User` DROP COLUMN `lockedUntil`, DROP COLUMN `failedAttempts`;
