-- CreateTable
CREATE TABLE "Moviment" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "departmentId" TEXT,
    "relationshipId" TEXT,
    "ordinanceId" TEXT,
    "movimentType" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "origin" TEXT NOT NULL,
    "annotation" TEXT,
    "status" TEXT NOT NULL,
    "statusDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "compliance" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" TEXT,

    CONSTRAINT "Moviment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "login" TEXT,
    "sex" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "birthdate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "folderPath" TEXT,
    "description" TEXT,
    "instructions" TEXT,
    "phone" TEXT,
    "ldapGroupName" TEXT,
    "ldapGroupOU" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Relationship" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Relationship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resource" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResourceRelationship" (
    "id" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "relationshipId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ResourceRelationship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "avatarUrl" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "openTableFilter" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Setting" (
    "id" TEXT NOT NULL,
    "movimentCreateToDismissal" BOOLEAN NOT NULL DEFAULT false,
    "movimentCreateToIngress" BOOLEAN NOT NULL DEFAULT false,
    "ordinanceStartDateConfig" TEXT NOT NULL DEFAULT 'lastFetch',
    "ordinanceStartDaysBefore" INTEGER NOT NULL DEFAULT 3,
    "robotActionsActiveSchedule" BOOLEAN NOT NULL DEFAULT false,
    "robotActionsScheduleContent" TEXT,
    "robotFetchOrdinanceActiveSchedule" BOOLEAN NOT NULL DEFAULT false,
    "robotFetchOrdinanceScheduleContent" TEXT,
    "scriptExecuteEmailSendAfterCreate" BOOLEAN NOT NULL DEFAULT false,
    "scriptExecuteRequestAfterCreate" BOOLEAN NOT NULL DEFAULT false,
    "scriptExecuteWebscrapingAfterCreate" BOOLEAN NOT NULL DEFAULT false,
    "scriptRemovePendingBeforeCreate" BOOLEAN NOT NULL DEFAULT false,
    "scriptCreateAfterRevisedMoviment" BOOLEAN NOT NULL DEFAULT false,
    "scriptExecuteCreateEmailAfterCreate" BOOLEAN NOT NULL DEFAULT false,
    "keywordsToDismissal" TEXT DEFAULT '',
    "keywordsToEndLicense" TEXT DEFAULT '',
    "keywordsToEndSuspension" TEXT DEFAULT '',
    "keywordsToEndVacation" TEXT DEFAULT '',
    "keywordsToIngress" TEXT DEFAULT '',
    "keywordsToStartLicense" TEXT DEFAULT '',
    "keywordsToStartSuspension" TEXT DEFAULT '',
    "keywordsToStartVacation" TEXT DEFAULT '',
    "movimentCreateToEndLicense" BOOLEAN NOT NULL DEFAULT false,
    "movimentCreateToEndSuspension" BOOLEAN NOT NULL DEFAULT false,
    "movimentCreateToEndVacation" BOOLEAN NOT NULL DEFAULT false,
    "movimentCreateToStartLicense" BOOLEAN NOT NULL DEFAULT false,
    "movimentCreateToStartSuspension" BOOLEAN NOT NULL DEFAULT false,
    "movimentCreateToStartVacation" BOOLEAN NOT NULL DEFAULT false,
    "ordinanceSendEmailDestiny" TEXT,
    "ordinanceSendEmailToDismissal" BOOLEAN NOT NULL DEFAULT false,
    "ordinanceSendEmailToEndLicense" BOOLEAN NOT NULL DEFAULT false,
    "ordinanceSendEmailToEndSuspension" BOOLEAN NOT NULL DEFAULT false,
    "ordinanceSendEmailToEndVacation" BOOLEAN NOT NULL DEFAULT false,
    "ordinanceSendEmailToIngress" BOOLEAN NOT NULL DEFAULT false,
    "ordinanceSendEmailToStartLicense" BOOLEAN NOT NULL DEFAULT false,
    "ordinanceSendEmailToStartSuspension" BOOLEAN NOT NULL DEFAULT false,
    "ordinanceSendEmailToStartVacation" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ordinance" (
    "id" TEXT NOT NULL,
    "publication" TIMESTAMP(3) NOT NULL,
    "ordinanceType" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "employeeName" TEXT,
    "departmentName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "departmentId" TEXT,
    "employeeId" TEXT,
    "ordinanceUrl" TEXT,

    CONSTRAINT "Ordinance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Script" (
    "id" TEXT NOT NULL,
    "movimentId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "scriptContent" TEXT NOT NULL,
    "emailContent" TEXT,
    "status" TEXT NOT NULL,
    "statusDate" TIMESTAMP(3) NOT NULL,
    "scriptType" TEXT NOT NULL,
    "annotation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Script_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Email" (
    "id" TEXT NOT NULL,
    "movimentId" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "cc" TEXT,
    "cco" TEXT,
    "subject" TEXT NOT NULL,
    "preview" TEXT,
    "text" TEXT,
    "html" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uniqueKey" TEXT NOT NULL,
    "scriptId" TEXT NOT NULL,

    CONSTRAINT "Email_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "resourceId" TEXT NOT NULL,
    "movimentType" TEXT NOT NULL,
    "scriptType" TEXT NOT NULL,
    "scriptContent" TEXT NOT NULL,
    "emailContent" TEXT,
    "sendEmail" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SysLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SysLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Moviment_number_key" ON "Moviment"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_cpf_key" ON "Employee"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Ordinance_number_key" ON "Ordinance"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Script_number_key" ON "Script"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Email_uniqueKey_key" ON "Email"("uniqueKey");

-- AddForeignKey
ALTER TABLE "Moviment" ADD CONSTRAINT "Moviment_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Moviment" ADD CONSTRAINT "Moviment_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Moviment" ADD CONSTRAINT "Moviment_ordinanceId_fkey" FOREIGN KEY ("ordinanceId") REFERENCES "Ordinance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Moviment" ADD CONSTRAINT "Moviment_relationshipId_fkey" FOREIGN KEY ("relationshipId") REFERENCES "Relationship"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceRelationship" ADD CONSTRAINT "ResourceRelationship_relationshipId_fkey" FOREIGN KEY ("relationshipId") REFERENCES "Relationship"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceRelationship" ADD CONSTRAINT "ResourceRelationship_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ordinance" ADD CONSTRAINT "Ordinance_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ordinance" ADD CONSTRAINT "Ordinance_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Script" ADD CONSTRAINT "Script_movimentId_fkey" FOREIGN KEY ("movimentId") REFERENCES "Moviment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Script" ADD CONSTRAINT "Script_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Email" ADD CONSTRAINT "Email_movimentId_fkey" FOREIGN KEY ("movimentId") REFERENCES "Moviment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLog" ADD CONSTRAINT "UserLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

