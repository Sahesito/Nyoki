-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "action" TEXT NOT NULL,
    "userId" UUID,
    "organizationId" UUID,
    "ip" TEXT,
    "emailHash" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "audit_logs_action_emailHash_createdAt_idx" ON "audit_logs"("action", "emailHash", "createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_action_ip_createdAt_idx" ON "audit_logs"("action", "ip", "createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_organizationId_createdAt_idx" ON "audit_logs"("organizationId", "createdAt");
