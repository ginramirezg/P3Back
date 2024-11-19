import { ObjectId } from "mongodb";

// Tipo para los niños, que se usa en las respuestas del servidor
export type niños = {
  _id: string; // ID del niño convertido a string
  nombre: string;
  ubicacion: string; // Nombre de la ubicación
  comportamiento: "bueno" | "malo"; // El comportamiento puede ser "bueno" o "malo"
};

// Tipo para los lugares, que se usa en las respuestas del servidor
export type lugares = {
  _id: string; // ID del lugar convertido a string
  nombre: string;
  coordenadas: {
    lat: number; // Latitud
    lon: number; // Longitud
  };
  num_niños: number; // Número de niños en ese lugar
};

// Tipo de los modelos de los niños en la base de datos (sin el tipo ObjectId transformado a string)
export type niñosModel = {
  _id?: ObjectId; // El ID original es de tipo ObjectId, pero lo transformamos a string cuando lo usamos
  nombre: string;
  ubicacion: string;
  comportamiento: "bueno" | "malo"; // El comportamiento puede ser "bueno" o "malo"
};

// Tipo de los modelos de los lugares en la base de datos (sin el tipo ObjectId transformado a string)
export type lugaresModel = {
  _id?: ObjectId; // El ID original es de tipo ObjectId
  nombre: string;
  coordenadas: {
    lat: number;
    lon: number;
  };
  num_niños: number;
};
