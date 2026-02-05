-- 1️⃣ Adicionar coluna TEMPORARIAMENTE como nullable
ALTER TABLE `Task`
ADD COLUMN `dueAt` DATETIME NULL;

-- 2️⃣ Preencher tarefas antigas
UPDATE `Task`
SET `dueAt` = NOW()
WHERE `dueAt` IS NULL;

-- 3️⃣ Tornar a coluna obrigatória
ALTER TABLE `Task`
MODIFY COLUMN `dueAt` DATETIME NOT NULL;

-- 4️⃣ (opcional) remover colunas antigas
ALTER TABLE `Task`
DROP COLUMN `date`,
DROP COLUMN `time`;
