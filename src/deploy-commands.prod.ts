import FrennyDJBot from './bots/FrennyDJBot/FrennyDJBot';

/**
 * Deploy commands globally
 */

// Frenny DJ Bot commands
FrennyDJBot.deployCommandsGlobally(() => {
	console.log(
		`Successfully registered ${FrennyDJBot.name} commands globally`
	);
});
