import {z } from 'zod';

export const GameObjectSchema = z.object({
    name: z.string(),
    url: z.string().endsWith('.png', {message: 'La URL debe terminar en .png'}),
});

export type GameObject = z.infer<typeof GameObjectSchema>;

export const inventoryGroups: Record<string, GameObject[]> = {
    grupo1: [
        { name: "Objeto A", url: "/assets/images/grupo1/obj1.png" },
        { name: "Objeto B", url: "/assets/images/grupo1/obj2.png" },
        { name: "Objeto C", url: "/assets/images/grupo1/obj3.png" },
        { name: "Objeto D", url: "/assets/images/grupo1/obj4.png" },
        { name: "Objeto E", url: "/assets/images/grupo1/obj5.png" },
        { name: "Objeto F", url: "/assets/images/grupo1/obj6.png" },
        { name: "Objeto G", url: "/assets/images/grupo1/obj7.png" },
        { name: "Objeto H", url: "/assets/images/grupo1/obj8.png" },
    ],
    grupo2: [
        { name: "Objeto A", url: "/assets/images/grupo2/obj1.png" },
        { name: "Objeto B", url: "/assets/images/grupo2/obj2.png" },
        { name: "Objeto C", url: "/assets/images/grupo2/obj3.png" },
        { name: "Objeto D", url: "/assets/images/grupo2/obj4.png" },
        { name: "Objeto E", url: "/assets/images/grupo2/obj5.png" },
        { name: "Objeto F", url: "/assets/images/grupo2/obj6.png" },
        { name: "Objeto G", url: "/assets/images/grupo2/obj7.png" },
        { name: "Objeto H", url: "/assets/images/grupo2/obj8.png" },
    ],
};