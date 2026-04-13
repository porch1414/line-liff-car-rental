CREATE TABLE `bookings` (
	`id` varchar(64) NOT NULL,
	`lineUserId` varchar(255) NOT NULL,
	`lineUserName` varchar(255) NOT NULL,
	`carId` varchar(64) NOT NULL,
	`pickupDate` timestamp NOT NULL,
	`returnDate` timestamp NOT NULL,
	`pickupLocation` varchar(255) NOT NULL,
	`totalPrice` int NOT NULL,
	`status` varchar(50) NOT NULL DEFAULT 'confirmed',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bookings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cars` (
	`id` varchar(64) NOT NULL,
	`brand` varchar(100) NOT NULL,
	`name` varchar(100) NOT NULL,
	`category` varchar(50) NOT NULL,
	`pricePerDay` int NOT NULL,
	`image` text,
	`rating` int,
	`reviews` int,
	`seats` int,
	`transmission` varchar(50),
	`fuelType` varchar(50),
	`available` int NOT NULL DEFAULT 1,
	`badge` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cars_id` PRIMARY KEY(`id`)
);
