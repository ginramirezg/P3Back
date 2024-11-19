/* JORGE FERRERO DE LARA
GINA ANDREA RAMIREZ GUERRERO */

import { MongoClient } from "mongodb";
import { fromModelToNiño, fromModelToLugar } from "./resolvers.ts";
import type { niñosModel, lugaresModel } from "./types.ts";

const MONGO_URL = Deno.env.get("MONGO_URL");

if (!MONGO_URL) {
  console.error("MONGO_URL is not set");
  Deno.exit(1);
}

const client = new MongoClient(MONGO_URL);
await client.connect();

console.info("Connected to MongoDB");

const db = client.db("practica3");
const niñosCollection = db.collection<niñosModel>("niños");
const lugaresCollection = db.collection<lugaresModel>("lugares");

// Handler principal
const handler = async (req: Request): Promise<Response> => {
  const method = req.method;
  const url = new URL(req.url);
  const path = url.pathname;

  if (method === "GET") {
    if (path === "/ninos/buenos") {
      const niñosBuenos = await niñosCollection.find({ comportamiento: "bueno" }).toArray();
      console.log("Niños buenos encontrados:", niñosBuenos); // Log para depuración

      const niñosBuenosTransformados = await Promise.all(
        niñosBuenos.map((n) => fromModelToNiño(n, lugaresCollection))
      );

      return new Response(JSON.stringify(niñosBuenosTransformados), { status: 200 });
    } else if (path === "/ninos/malos") {
      const niñosMalos = await niñosCollection.find({ comportamiento: "malo" }).toArray();
      const niñosBuenosConUbicacion = await Promise.all(
        niñosMalos.map(async (n) => await fromModelToNiño(n, lugaresCollection))
      );
      return new Response(JSON.stringify(niñosBuenosConUbicacion), { status: 200 });
    } else if (path === "/entregas") {
      const lugares = await lugaresCollection
        .find()
        .sort({ num_niños: -1 })
        .toArray();
      return new Response(JSON.stringify(lugares.map(fromModelToLugar)), {
        status: 200,
      });
    } else if (path === "/ruta") {
      const lugares = await lugaresCollection
        .find()
        .sort({ num_niños: -1 })
        .toArray();
      const totalDistancia = lugares.reduce((acc, lugar, index) => {
        if (index === 0) return acc;
        const anterior = lugares[index - 1].coordenadas;
        const actual = lugar.coordenadas;
        return acc + calculaDistancia(anterior, actual);
      }, 0);
      return new Response(JSON.stringify({ distanciaTotal: totalDistancia }), {
        status: 200,
      });
    }
  } else if (method === "POST") {
    const body = await req.json();

    if (path === "/ubicacion") {
      const existe = await lugaresCollection.findOne({ nombre: body.nombre });
      if (existe) {
        return new Response("El nombre del lugar ya existe", { status: 400 });
      }
      await lugaresCollection.insertOne(body);
      return new Response("Lugar agregado", { status: 201 });
    } else if (path === "/ninos") {
      const existe = await niñosCollection.findOne({ nombre: body.nombre });
      if (existe) {
        return new Response("El nombre del niño ya existe", { status: 400 });
      }
      if (!["bueno", "malo"].includes(body.comportamiento)) {
        return new Response("Comportamiento no válido", { status: 400 });
      }
      await niñosCollection.insertOne(body);
      return new Response("Niño agregado", { status: 201 });
    }
  }

  return new Response("Endpoint no encontrado", { status: 404 });
};

// Función para calcular distancia (fórmula Haversine)
const calculaDistancia = (
  coord1: { lat: number; lon: number },
  coord2: { lat: number; lon: number }
): number => {
  const R = 6371; // Radio de la Tierra en km
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const dLon = ((coord2.lon - coord1.lon) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.lat * Math.PI) / 180) *
      Math.cos((coord2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

Deno.serve({ port: 6768 }, handler);
