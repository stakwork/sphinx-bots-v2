export interface MessageContent {
  uuid: string;
  content: string | { [k: string]: string };
  amount: number;
  id?: number;
  replyUuid?: string;
  mediaToken?: string;
  mediaKey?: string;
  mediaType?: string;
  date?: Date;
  originalMuid?: string;
  status?: number;
  purchaser?: number;
  invoice?: string;
  parentId?: number;
  push?: boolean;
  mediaTerms?: LdatTerms;
  skipPaymentProcessing?: boolean;
  recipientAlias?: string;
  recipientPic?: string;
  person?: string;
  thread_uuid?: string;
}

export interface LdatTermsMeta {
  amt?: number;
  ttl?: number;
  dim?: string;
}
export interface LdatTerms {
  host: string;
  ttl: number | null;
  muid: string;
  pubkey?: string;
  meta: LdatTermsMeta;
  ownerPubkey?: string;
  skipSigning?: boolean;
}

export type ChatMembers = { [k: string]: ChatMember };

// fro group join msgs, etc
export interface ChatMember {
  role?: number;
  key: string;
  alias: string;
}

export interface ChatContent {
  uuid: string;
  type?: number;
  members?: { [k: string]: ChatMember };
  name?: string;
  groupKey?: string;
  host?: string;
  myAlias?: string;
  myPhotoUrl?: string;
}

export interface SenderContent {
  id?: number;
  pub_key: string;
  alias: string;
  role: number;
  route_hint?: string;
  photo_url?: string;
  contact_key?: string;
  person?: string;
}

export interface Msg {
  type: number;
  message: MessageContent;
  sender: SenderContent;
  error_message?: string;
}

export interface BotMsg extends Msg {
  bot_id?: any;
  bot_uuid?: string;
  bot_name?: string;
  recipient_id?: any;
  action?: string;
}

export type ActionType = "broadcast" | "pay" | "keysend" | "dm";

export interface Action {
  action: ActionType;
  chat_uuid: string;
  bot_id: string;
  bot_name?: string;
  amount?: number;
  pubkey?: string;
  content?: string;
  msg_uuid?: string;
  reply_uuid?: string;
  route_hint?: string;
  recipient_id?: number;
  parent_id?: number;
  bot_pic?: string;
  only_owner?: boolean;
  only_user?: number;
  only_pubkey?: string;
  recipient_pubkey?: string;
}
