import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({
  tableName: "sphinx_chat_bots",
  underscored: true,
  indexes: [{ unique: true, fields: ["chat_pubkey"] }],
})
export default class ChatBot extends Model<ChatBot> {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    unique: true,
    autoIncrement: true,
  })
  id!: number;

  @Column
  chatPubkey!: string;

  @Column
  botId!: string;

  @Column
  botType!: number;

  @Column
  botPrefix!: string;

  @Column
  botMakerPubkey!: string;

  @Column
  botMakerRouteHint!: string;

  @Column
  msgTypes!: string;

  @Column
  meta!: string; // for saved preferences for local bots

  @Column
  pricePerUse!: number;

  @Column
  createdAt!: Date;

  @Column
  updatedAt!: Date;

  @Column(DataType.TEXT)
  hiddenCommands!: string;
}

export interface ChatBotRecord extends ChatBot {
  dataValues: ChatBot;
}
