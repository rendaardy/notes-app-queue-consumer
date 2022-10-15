import process from "node:process";

import * as dotenv from "dotenv";
import amqp from "amqplib";

import { NotesService } from "./notes-service.js";
import { MailSender } from "./mail-sender.js";
import { Listener } from "./listener.js";

dotenv.config();

const notesService = new NotesService();
const mailSender = new MailSender();
const listener = new Listener(notesService, mailSender);

const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
const channel = await connection.createChannel();

await channel.assertQueue("export:notes", { durable: true });

channel.consume("export:notes", listener.listen, { noAck: true });
