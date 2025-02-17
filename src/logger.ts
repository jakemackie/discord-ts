import winston from 'winston';

export const logger = winston.createLogger({
	level: 'info',
	format: winston.format.printf(({ level, message }) => {
		return `[${new Date().toISOString()}] [${level.toUpperCase()}]: ${message}`;
	}),
	transports: [new winston.transports.Console()]
});
