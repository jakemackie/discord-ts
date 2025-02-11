import dotenv from 'dotenv';
import { ExtendedClient } from './structures/Client';

dotenv.config();
const token: string = process.env.DISCORD_CLIENT_TOKEN;

const client = new ExtendedClient();
client.init(token);
