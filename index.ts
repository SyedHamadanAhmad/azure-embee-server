// Import the express in typescript file
import express from 'express';
import createConn from './models/model';
import bodyParser from 'body-parser';
import cors from 'cors';
import { error } from 'console';
import { get } from 'http';




// Initialize the express engine

const app: express.Application = express();
app.use(cors({
	origin: [
	  'https://embee-azure-client-c2e7aeaggtgbb5g6.centralindia-01.azurewebsites.net', // Azure frontend URL
	  'http://localhost:8080' // Localhost for development
	],
	methods: ['GET', 'POST', 'PUT', 'DELETE'], // List all HTTP methods you need
	allowedHeaders: ['Content-Type', 'Authorization'], // Include any headers your frontend might send
	credentials: true // If you're sending cookies or using authentication
  }));
  
app.use(bodyParser.json()); // Parse JSON bodies


// Take a port 3000 for running server.
const port: number = 3000;

var conn=createConn();


interface QueryData {
	sno: number;
	region:string;
	account_manager: string;
	customer_name: string;
	enrollment_number:number;
	markup:number;
	jan: number;
	feb: number;
	march: number;
	april: number;
	may: number;
	june: number;
	july: number;
	aug: number;
	sep: number;
	oct: number;
	nov: number;
	dec: number;
	total:number;

  }

  
  async function getAllEA() {
	try {
	  const [data] = await (await conn).query('SELECT * FROM ea_consumption');
	  return data;
	} catch (error) {
	  console.error('Database query failed:', error);
	  throw error;
	}
  }
  async function getManagerDataEA(names:string[]){
	try {
		const results: QueryData[] = [];
		for (let i = 0; i < names.length; i++) {
			const AMname = names[i];
			const AMquery = `SELECT * FROM ea_consumption WHERE account_manager='${AMname}'`;
			const [rows, fields] = await (await conn).query(AMquery); // fields is not used but included for clarity
			results.push(...rows as QueryData[]); // Use spread operator to push all rows
		}
		return results;
	} catch (err) {
		console.log("ERROR: ", err);
	}
  }
  async function getManagerDataCSP(names:string[]){
	try {
		const results: QueryData[] = [];
		for (let i = 0; i < names.length; i++) {
			const AMname = names[i];
			const AMquery = `SELECT * FROM csp_consumption WHERE account_manager='${AMname}'`;
			const [rows, fields] = await (await conn).query(AMquery); // fields is not used but included for clarity
			results.push(...rows as QueryData[]); // Use spread operator to push all rows
		}
		return results;
	} catch (err) {
		console.log("ERROR: ", err);
	}
  }


  async function getAMdataEA(name:string){
	try {
		const results: QueryData[] = [];
			const AMquery = `SELECT * FROM ea_consumption WHERE account_manager='${name}'`;
			const [rows, fields] = await (await conn).query(AMquery); // fields is not used but included for clarity
			results.push(...rows as QueryData[]); // Use spread operator to push all rows
			return results;
		}
		
	 catch (err) {
		console.log("ERROR: ", err);
	}
  }

  async function getCompanyDataEA(name:string){
	try {
		const results: QueryData[] = [];
			const AMquery = `SELECT * FROM ea_consumption WHERE customer_name='${name}'`;
			const [rows, fields] = await (await conn).query(AMquery); // fields is not used but included for clarity
			results.push(...rows as QueryData[]); // Use spread operator to push all rows
			return results;
		}
		
	 catch (err) {
		console.log("ERROR: ", err);
	}
  }
  async function getCompanyDataCSP(name:string){
	try {
		const results: QueryData[] = [];
			const AMquery = `SELECT * FROM csp_consumption WHERE customer_name='${name}'`;
			const [rows, fields] = await (await conn).query(AMquery); // fields is not used but included for clarity
			results.push(...rows as QueryData[]); // Use spread operator to push all rows
			return results;
		}
		
	 catch (err) { 
		console.log("ERROR: ", err);
	}
  }
  async function getAMdataCSP(name:string){
	try {
		const results: QueryData[] = [];
			const AMquery = `SELECT * FROM csp_consumption WHERE account_manager='${name}'`;
			const [rows, fields] = await (await conn).query(AMquery); // fields is not used but included for clarity
			results.push(...rows as QueryData[]); // Use spread operator to push all rows
			return results;
		}
		
	 catch (err) {
		console.log("ERROR: ", err);
	}
  }

  async function getAllCSP() {
	try {
	  const [data] = await (await conn).query('SELECT * FROM csp_consumption');
	  return data;
	} catch (error) {
	  console.error('Database query failed:', error);
	  throw error;
	}
  }

async function dropTableEA(){
	await (await conn).query("DROP TABLE ea_consumption;")
}
async function dropTableCSP(){
	await (await conn).query("DROP TABLE csp_consumption;")
}
async function createTableEA(){
	await (await conn).query(`
		CREATE TABLE \`azure_usage\`.\`ea_consumption\` (
		  \`sno\` INT NOT NULL AUTO_INCREMENT,
		  \`region\` VARCHAR(45) NOT NULL,
		  \`account_manager\` VARCHAR(255) NOT NULL,
		  \`enrollment_no\` INT NOT NULL,
		  \`customer_name\` VARCHAR(255) NOT NULL,
		  \`markup\` INT NULL,
		  \`jan\` INT NULL,
		  \`feb\` INT NULL,
		  \`march\` INT NULL,
		  \`april\` INT NULL,
		  \`may\` INT NULL,
		  \`june\` INT NULL,
		  \`july\` INT NULL,
		  \`aug\` INT NULL,
		  \`sep\` INT NULL,
		  \`oct\` INT NULL,
		  \`nov\` INT NULL,
		  \`dec\` INT NULL,
		  \`total\` INT NOT NULL,
		  PRIMARY KEY (\`sno\`)
		);
	  `);
	  console.log("EA Consumption Table created successfully")
	  
}

async function updateTableEA(query: string): Promise<boolean> {
	try {
	  const connection = await conn;
	  
	  // Escape the 'dec' column name using backticks
	  await connection.query(`
		INSERT INTO ea_consumption 
		(region, account_manager, enrollment_no, customer_name, markup, april, may, june, july, aug, sep, oct, nov, \`dec\`, jan, feb, march, total) 
		VALUES ${query};
	  `);
	  
	  console.log("EA Consumption table updated successfully");
	  return true; // Return true if successful
	} catch (error) {
	  console.error("Error updating EA Consumption table:", error);
	  return false; // Return false if an error occurs
	}
  }

async function getAMs(name:string){
	try {
		const [data] = await (await conn).query(`SELECT * FROM profiles WHERE superior='${name}'`);
		return data;
	  } catch (error) {
		console.error('Database query failed:', error);
		throw error;
	  }
}


async function createTableCSP(){
	await (await conn).query(`
		CREATE TABLE \`azure_usage\`.\`csp_consumption\` (
		  \`sno\` INT NOT NULL AUTO_INCREMENT,
		  \`region\` VARCHAR(45) NOT NULL,
		  \`account_manager\` VARCHAR(255) NOT NULL,
		  \`enrollment_no\` INT NOT NULL,
		  \`customer_name\` VARCHAR(255) NOT NULL,
		  \`markup\` INT NULL,
		  \`jan\` INT NULL,
		  \`feb\` INT NULL,
		  \`march\` INT NULL,
		  \`april\` INT NULL,
		  \`may\` INT NULL,
		  \`june\` INT NULL,
		  \`july\` INT NULL,
		  \`aug\` INT NULL,
		  \`sep\` INT NULL,
		  \`oct\` INT NULL,
		  \`nov\` INT NULL,
		  \`dec\` INT NULL,
		  \`total\` INT NOT NULL,
		  PRIMARY KEY (\`sno\`)
		);
	  `);
	  console.log("CSP Consumption Table created successfully")
	  
}


async function updateTableCSP(query: string): Promise<boolean> {
	try {
	  const connection = await conn;
	  
	  // Escape the 'dec' column name using backticks
	  await connection.query(`
		INSERT INTO csp_consumption 
		(region, account_manager, enrollment_no, customer_name, markup, april, may, june, july, aug, sep, oct, nov, \`dec\`, jan, feb, march, total) 
		VALUES ${query};
	  `);
	  
	  console.log("CSP Consumption table updated successfully");
	  return true; // Return true if successful
	} catch (error) {
	  console.error("Error updating CSP Consumption table:", error);
	  return false; // Return false if an error occurs
	}
  }
  
// Handling '/' req: express.Requestuest
app.get('/', (_req: express.Request, _res: express.Response) => {
	_res.send("TypeScript With Express");
});

app.get('/get-all-ea', async (_req: express.Request, _res: express.Response) => {
	try {
	  const data = await getAllEA();
	  _res.json(data);
	} catch (error) {
	  console.error('Error fetching data:', error);
	  _res.status(500).json({ error: 'Failed to fetch data' });
	}
  });

  app.get('/get-all-csp', async (_req: express.Request, _res: express.Response) => {
	try {
	  const data = await getAllCSP();
	  _res.json(data);
	} catch (error) {
	  console.error('Error fetching data:', error);
	  _res.status(500).json({ error: 'Failed to fetch data' });
	}
  });

  app.get(`/getAMs/:name`, async(_req: express.Request, _res: express.Response)=>{
	var name=_req.params.name
	try {
		const data = await getAMs(name);
		console.log(data)
		_res.json(data);
	  } catch (error) {
		console.error('Error fetching data:', error);
		_res.status(500).json({ error: 'Failed to fetch data' });
	  }

  })
  app.get('/get-token', async (req: express.Request, res: express.Response) => {
	try {
	  const response = await fetch('https://login.microsoftonline.com/feebb8e1-2ddf-4da2-b3b3-ae51c474f838/oauth2/token', {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams({
		  grant_type: 'client_credentials',
		  client_id: '0e5d596b-75db-470a-9bdc-3a34e3fd3f56',
		  client_secret: 'OaU8Q~CK5wuIWPDNk7EO~1F-YNICbinguChM7ca1',
		  resource: 'https://graph.microsoft.com',
		}),
	  });
	  if (!response.ok) {
		console.error('Error getting token:', response.status, response.statusText);
		return res.status(500).json({ error: 'Failed to get token' });
	  }
	  const data = await response.json();
	  res.json({ access_token: data.access_token });
	} catch (err) {
	  console.log("Error ", err);
	  res.status(500).send('Internal Server Error');
	}
  });


  
  app.get('/get-users-by-manager/:name', async (req: express.Request, res: express.Response) => {
	try {
	  // Step 1: Fetch the token
	  const tokenResponse = await fetch('http://localhost:3000/get-token');
	  if (!tokenResponse.ok) {
		console.error('Error fetching token:', tokenResponse.status, tokenResponse.statusText);
		return res.status(500).json({ error: 'Failed to fetch token' });
	  }
	  const tokenData = await tokenResponse.json();
	  const authToken = tokenData.access_token;
	  const managerName = req.params.name;
  
	  // Step 2: Fetch all users
	  const userResponse = await fetch('https://graph.microsoft.com/v1.0/users', {
		method: 'GET',
		headers: {
		  'Authorization': `Bearer ${authToken}`,
		},
	  });
  
	  if (!userResponse.ok) {
		const userResponseText = await userResponse.text();
		console.error('Error fetching users:', userResponse.status, userResponse.statusText, userResponseText);
		return res.status(userResponse.status).json({ error: 'Failed to fetch users', details: userResponseText });
	  }
  
	  const users = await userResponse.json();
  
	  // Step 3: For each user, fetch the manager's details
	  const usersWithManager = await Promise.all(users.value.map(async (user:any) => {
		const managerResponse = await fetch(`https://graph.microsoft.com/v1.0/users/${user.id}/manager`, {
		  method: 'GET',
		  headers: {
			'Authorization': `Bearer ${authToken}`,
		  },
		});
  
		if (managerResponse.ok) {
		  const managerData = await managerResponse.json();
		  return { ...user, manager: managerData };
		} else {
		  return null; // If no manager, return null to filter out later
		}
	  }));
  
	  // Step 4: Filter the users based on the manager's name
	  const filteredUsers = usersWithManager.filter(user => user && user.manager.displayName === managerName);
  
	  // Step 5: Return the filtered users
	  res.json(filteredUsers);
	} catch (err) {
	  console.log("Error ", err);
	  res.status(500).send('Internal Server Error');
	}
  });
  
  app.get('/getCompanyDataEA/:name', async(req: express.Request, res: express.Response)=>{
	try {
		const companyName=req.params.name
		const data = await getCompanyDataEA(companyName);
		res.json(data);
	  } catch (error) {
		console.error('Error fetching data:', error);
		res.status(500).json({ error: 'Failed to fetch data' });
	  }
  })
  app.get('/getCompanyDataCSP/:name', async(req: express.Request, res: express.Response)=>{
	try {
		const companyName=req.params.name
		const data = await getCompanyDataCSP(companyName);
		res.json(data);
	  } catch (error) {
		console.error('Error fetching data:', error);
		res.status(500).json({ error: 'Failed to fetch data' });
	  }
  })



  app.post('/excel-data-ea', async (req: express.Request, res: express.Response) => {
	const excelData: QueryData[] = req.body.data; // Explicitly type excelData
	if (!excelData) {
	  return res.status(400).send('No data provided');
	}
  
	try {
	  // Drop and create table
	  
	  
	
	  // Process the data
	  const processedData = excelData.slice(1).map((row: QueryData) => {
		// Remove the first element of the row (the sequence number) using slice(1)
		const values = Object.values(row).slice(1).map((value, index) => {
		  if (index === 0 || index === 1 || index === 3) { // Adjusted index due to slice(1)
			return `'${value}'`; // Wrap these columns in single quotes
		  } else if (value === null || value === undefined || value === '' || value === '-') {
			return 'NULL'; // Handle null or undefined values
		  } else {
			return value;
		  }
		}).join(', ');
		return `(${values})`;
	  }).join(', ');
	  
	  console.log(processedData);
	  
	  const isUpdated = await updateTableEA(processedData);
	  
	  if (isUpdated) {
		await dropTableEA();
	  	await createTableEA();
		await updateTableEA(processedData);
		res.status(200).send('Data received and table updated successfully');
	  } else {
		res.status(500).send('Error updating the CSP Consumption table');
	  }
  
	} catch (error) {
	  console.error('Error processing data:', error);
	  res.status(500).send('An error occurred while processing data');
	}
  });






app.post('/getManagerDataEA', async (req: express.Request, res: express.Response) => {
	try {
	  const names: string[] = req.body.names; // Expecting { names: string[] } in the request body
	  if (!Array.isArray(names)) {
		return res.status(400).json({ error: 'Invalid input' });
	  }
	  const data = await getManagerDataEA(names);
	  res.json(data);
	} catch (err) {
	  res.status(500).json({ error: 'An error occurred' });
	}
  });
  app.post('/getManagerDataCSP', async (req: express.Request, res: express.Response) => {
	try {
	  const names: string[] = req.body.names; // Expecting { names: string[] } in the request body
	  if (!Array.isArray(names)) {
		return res.status(400).json({ error: 'Invalid input' });
	  }
	  const data = await getManagerDataCSP(names);
	  res.json(data);
	} catch (err) {
	  res.status(500).json({ error: 'An error occurred' });
	}
  });



app.get('/getAMdataEA/:name', async (req: express.Request, res: express.Response) => {
	try {
	  const name: string = req.params.name; // Expecting { names: string[] } in the request body
	  
	  const data = await getAMdataEA(name);
	  res.json(data);
	} catch (err) {
	  res.status(500).json({ error: 'An error occurred' });
	}
  });

 

  app.get('/getAMdataCSP/:name', async (req: express.Request, res: express.Response) => {
	try {
	  const name: string = req.params.name; // Expecting { names: string[] } in the request body
	  
	  const data = await getAMdataCSP(name);
	  res.json(data);
	} catch (err) {
	  res.status(500).json({ error: 'An error occurred' });
	}
  });


   app.post('/excel-data-csp', async (req: express.Request, res: express.Response) => {
	const excelData: QueryData[] = req.body.data; // Explicitly type excelData
	if (!excelData) {
	  return res.status(400).send('No data provided');
	}
  
	try {
	  // Drop and create table
	  
	  
	
	  // Process the data
	  const processedData = excelData.slice(1).map((row: QueryData) => {
		// Remove the first element of the row (the sequence number) using slice(1)
		const values = Object.values(row).slice(1).map((value, index) => {
		  if (index === 0 || index === 1 || index === 3) { // Adjusted index due to slice(1)
			return `'${value}'`; // Wrap these columns in single quotes
		  } else if (value === null || value === undefined || value === '' || value === '-') {
			return 'NULL'; // Handle null or undefined values
		  } else {
			return value;
		  }
		}).join(', ');
		return `(${values})`;
	  }).join(', ');
	  
	  console.log(processedData);
	  
	  const isUpdated = await updateTableCSP(processedData);
	  
	  if (isUpdated) {
		await dropTableCSP();
	  	await createTableCSP();
		await updateTableCSP(processedData);
		res.status(200).send('Data received and table updated successfully');
	  } else {
		res.status(500).send('Error updating the CSP Consumption table');
	  }
  
	} catch (error) {
	  console.error('Error processing data:', error);
	  res.status(500).send('An error occurred while processing data');
	}
  });


  function getMonthName(monthIndex: number): string {
    const monthNames = ["jan", "feb", "march", "april", "may", "june", "july", "aug", "sep", "oct", "nov", "dec"];
    return monthNames[monthIndex];
  }


 async function getRankEA(customerName:string, month:string){
	try{
		const [rankQuery]=await (await conn).query(`WITH OrderedCustomers AS (
    SELECT customer_name, ROW_NUMBER() OVER (ORDER BY ${month} DESC) AS position
    FROM ea_consumption
)
SELECT  position
FROM OrderedCustomers
WHERE customer_name = '${customerName}';`)
return rankQuery;
	}
	catch(err){
		console.error("ERROR GENERATING RANK:", err);
		throw error;
	}
  }
  async function getRankCSP(customerName:string, month:string){
	try{
		const [rankQuery]=await (await conn).query(`WITH OrderedCustomers AS (
    SELECT customer_name, ROW_NUMBER() OVER (ORDER BY ${month} DESC) AS position
    FROM csp_consumption
)
SELECT  position
FROM OrderedCustomers
WHERE customer_name = '${customerName}';`)
return rankQuery;
	}
	catch(err){
		console.error("ERROR GENERATING RANK:", err);
		throw error;
	}
  }

  
  async function getAverageEA(){
	try{	
		const [averages] = await (await conn).query(`SELECT AVG(\`jan\`), AVG(\`feb\`), AVG(\`march\`), AVG(\`april\`), AVG(\`may\`), AVG(\`june\`), AVG(\`july\`), AVG(\`aug\`), AVG(\`sep\`), AVG(\`oct\`), AVG(\`nov\`), AVG(\`dec\`) from ea_consumption` );
		return averages;
	}
	catch(err){
		console.error("ERROR GENERATING AVERAGE:", err);
		throw error;
	}
  }

  app.get('/getAverageEA', async(req: express.Request, res: express.Response)=>{
	try{	
		const data=await getAverageEA();
		res.json(data);

	}
	catch(err){
		console.error("ERROR GETTING AVERAGE:", err);
		throw error;
	}
  })

  async function getAverageCSP(){
	try{	
		const [averages] = await (await conn).query(`SELECT AVG(\`jan\`), AVG(\`feb\`), AVG(\`march\`), AVG(\`april\`), AVG(\`may\`), AVG(\`june\`), AVG(\`july\`), AVG(\`aug\`), AVG(\`sep\`), AVG(\`oct\`), AVG(\`nov\`), AVG(\`dec\`) from csp_consumption` );
		return averages;
	}
	catch(err){
		console.error("ERROR GENERATING AVERAGE:", err);
		throw error;
	}
  }

  app.get('/getAverageCSP', async(req: express.Request, res: express.Response)=>{
	try{	
		const data=await getAverageCSP();
		res.json(data);

	}
	catch(err){
		console.error("ERROR GETTING AVERAGE:", err);
		throw error;
	}
  })
 
app.get('/getRankEA/:name', async(req: express.Request, res: express.Response)=>{
	try{
		const companyName=req.params.name;
		const currentDate = new Date();
 		const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-based index
  		const previousMonth = (currentMonth === 1) ? 12 : currentMonth - 1;
  		const monthBeforePrevious = (previousMonth === 1) ? 12 : previousMonth - 1;
		const previousMonthName=getMonthName(previousMonth)
		const monthBeforePreviousName=getMonthName(monthBeforePrevious);
		const data1=await getRankEA(companyName, previousMonthName)
		const data2=await getRankEA(companyName, monthBeforePreviousName);

		res.json([data1, data2]);
	}
	catch(err){
		console.error("ERROR GETTING RANK:", err);
		throw error;
	}
  })
  app.get('/getRankCSP/:name', async(req: express.Request, res: express.Response)=>{
	try{
		const companyName=req.params.name;
		const currentDate = new Date();
 		const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-based index
  		const previousMonth = (currentMonth === 1) ? 12 : currentMonth - 1;
  		const monthBeforePrevious = (previousMonth === 1) ? 12 : previousMonth - 1;
		const previousMonthName=getMonthName(previousMonth)
		const monthBeforePreviousName=getMonthName(monthBeforePrevious);
		const data1=await getRankCSP(companyName, previousMonthName)
		const data2=await getRankCSP(companyName, monthBeforePreviousName);

		res.json([data1, data2]);
	}
	catch(err){
		console.error("ERROR GETTING RANK:", err);
		throw error;
	}
  })

  async function EAgetSuperAdminNSE(){
	try{	
		const [data] = await (await conn).query(`SELECT * FROM ea_consumption WHERE  region IN ('North', 'South', 'East')` );
		return data;
	}
	catch(err){
		console.error("ERROR GENERATING AVERAGE:", err);
		throw error;
	}
  }

  async function CSPgetSuperAdminNSE(){
	try{	
		const [data] = await (await conn).query(`SELECT * FROM csp_consumption WHERE  region IN ('North', 'South', 'East')` );
		return data;
	}
	catch(err){
		console.error("ERROR GENERATING AVERAGE:", err);
		throw error;
	}
  }
  async function EAgetSuperAdminW(){
	try{	
		const [data] = await (await conn).query(`SELECT * FROM ea_consumption WHERE  region='West'` );
		return data;
	}
	catch(err){
		console.error("ERROR GENERATING SUPER ADMIN DATA EA:", err);
		throw error;
	}
  }

  async function CSPgetSuperAdminW(){
	try{	
		const [data] = await (await conn).query(`SELECT * FROM csp_consumption WHERE  region='West'` );
		return data;
	}
	catch(err){
		console.error("ERROR GENERATING SUPER ADMIN DATA EA:", err);
		throw error;
	}
  }

 // Endpoint for EAgetSuperAdminNSE
app.get('/EAgetSuperAdminNSE', async (req: express.Request, res: express.Response) => {
	try {
	  const data = await EAgetSuperAdminNSE();
	  res.status(200).json(data);
	} catch (err) {
	  res.status(500).json({ error: "Error retrieving EA Super Admin data for North, South, and East regions." });
	}
  });
  
  // Endpoint for CSPgetSuperAdminNSE
  app.get('/CSPgetSuperAdminNSE', async (req: express.Request, res: express.Response) => {
	try {
	  const data = await CSPgetSuperAdminNSE();
	  res.status(200).json(data);
	} catch (err) {
	  res.status(500).json({ error: "Error retrieving CSP Super Admin data for North, South, and East regions." });
	}
  });
  
  // Endpoint for EAgetSuperAdminW
  app.get('/EAgetSuperAdminW', async (req: express.Request, res: express.Response) => {
	try {
	  const data = await EAgetSuperAdminW();
	  res.status(200).json(data);
	} catch (err) {
	  res.status(500).json({ error: "Error retrieving EA Super Admin data for West region." });
	}
  });
  
  // Endpoint for CSPgetSuperAdminW
  app.get('/CSPgetSuperAdminW', async (req: express.Request, res: express.Response) => {
	try {
	  const data = await CSPgetSuperAdminW();
	  res.status(200).json(data);
	} catch (err) {
	  res.status(500).json({ error: "Error retrieving CSP Super Admin data for West region." });
	}
  });
  
// Server setup
app.listen(port, '0.0.0.0', () => {
	console.log(`TypeScript with Express 
		http://localhost:${port}/`);
		createConn();


});





