CREATE TABLE IF NOT EXISTS users (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chats (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type       VARCHAR(10) NOT NULL CHECK (type IN ('direct', 'group')),
  name       VARCHAR(100),
  -- Sorted "userA:userB" pair, so A-B and B-A map to the same 1:1 chat
  direct_key VARCHAR(73) UNIQUE,
  created_by UUID NOT NULL REFERENCES users (id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chats_direct_key_check CHECK ((type = 'direct') = (direct_key IS NOT NULL)),
  CONSTRAINT chats_group_name_check CHECK (type = 'direct' OR name IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS chat_members (
  chat_id   UUID NOT NULL REFERENCES chats (id) ON DELETE CASCADE,
  user_id   UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  role      VARCHAR(10) NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (chat_id, user_id)
);

-- Speeds up "list chats of a user"
CREATE INDEX IF NOT EXISTS chat_members_user_id_idx ON chat_members (user_id);
