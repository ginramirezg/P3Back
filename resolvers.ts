import type { Collection } from "mongodb";
import type { niños, niñosModel, lugares, lugaresModel } from "./types.ts";

// Convierte un documento de MongoDB (niñosModel) al tipo definido (niños)
export const fromModelToNiño = async (
    niñoDB: niñosModel,
    lugaresCollection: Collection<lugaresModel>
  ): Promise<niños> => {
    // Obtener la ubicación del niño
    const ubicacion = await lugaresCollection.findOne({ nombre: niñoDB.ubicacion });
  
    // Convertir el _id de ObjectId a string y devolver el niño
    return {
      _id: niñoDB._id?.toString() || "", // Convertimos _id de ObjectId a string
      nombre: niñoDB.nombre,
      comportamiento: niñoDB.comportamiento,
      ubicacion: ubicacion?.nombre || "Ubicación desconocida",
    };
  };
  

// Convierte un documento de MongoDB (lugaresModel) al tipo definido (lugares)
export const fromModelToLugar = (lugarDB: lugaresModel): lugares => ({
    _id: lugarDB._id?.toString() || "", // Convertimos _id de ObjectId a string
    nombre: lugarDB.nombre,
    coordenadas: lugarDB.coordenadas,
    num_niños: lugarDB.num_niños,
  });
  
