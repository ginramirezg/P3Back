import {MongoClient} from "mongodb";

const MONGO_URL = Deno.env.get("MONGO_URL"); //Obtenemos del .env las claves
/*Tenemos que comprobar que existan las claves, de lo contrario mostraremos 
un mensaje y finalizaremos el programa*/
if(!MONGO_URL){
	console.error("MONGO_URL is not set");
	Deno.exit(1);
}

const client = new MongoClient("MONGO_URL");
await client.connect();
console.info("Connected to MongoBD");
