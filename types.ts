import {ObjectId} from "mongodb";

enum comp{
    bueno = 1,
    malo = 0
}

export type ninos ={
    _id: string,
    nombre: string,
    ubicacion: string,
    comportamiento: comp,
}

export type lugares = {
    _id: string,
    nombre: string, 
    coordenadas: string, 
    num_niños: number
}

export type ninosModel = {
    id?: ObjectId,
    nombre: string,
    ubicacion: string,
    comportamiento: boolean

}

export type lugaresModel = {
    id?: ObjectId,
    nombre: string,
    coordenadas: string,
    num_niños:number


}