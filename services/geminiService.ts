import { GoogleGenAI, Type } from "@google/genai";
import { CabOption } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using a mock response.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const mockCabOptions: CabOption[] = [
    { serviceName: 'Rapido', carType: 'Bike', price: 60, etaMinutes: 3, deepLinkUrl: 'https://rapido.bike/', seats: 1, features: ['Helmet provided'] },
    { serviceName: 'Uber', carType: 'Moto', price: 65, etaMinutes: 4, deepLinkUrl: 'https://m.uber.com/', seats: 1, features: ['Affordable'] },
    { serviceName: 'inDrive', carType: 'Standard', price: 110, etaMinutes: 6, deepLinkUrl: 'https://indrive.com/en/home/', seats: 4, features: ['AC', 'Sedan'] },
    { serviceName: 'Uber', carType: 'Go', price: 120, etaMinutes: 5, deepLinkUrl: 'https://m.uber.com/', seats: 4, features: ['AC', 'Compact'] },
    { serviceName: 'Ola', carType: 'Mini', price: 125, etaMinutes: 7, deepLinkUrl: 'https://www.olacabs.com/', seats: 4, features: ['AC', 'Hatchback'] },
    { serviceName: 'BluSmart', carType: 'Electric Sedan', price: 140, etaMinutes: 9, deepLinkUrl: 'https://blu-smart.com/', seats: 4, features: ['AC', 'Electric', 'Eco-friendly'] },
    { serviceName: 'Uber', carType: 'XL', price: 180, etaMinutes: 4, deepLinkUrl: 'https://m.uber.com/', seats: 6, features: ['AC', 'Spacious', 'SUV'] },
    { serviceName: 'Ola', carType: 'Prime SUV', price: 190, etaMinutes: 8, deepLinkUrl: 'https://www.olacabs.com/', seats: 7, features: ['AC', 'Top Rated', 'SUV'] },
    { serviceName: 'Quick Ride', carType: 'Carpool', price: 90, etaMinutes: 10, deepLinkUrl: 'https://quickride.in/', seats: 1, features: ['Shared Ride'] },
];

const cabOptionsSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            serviceName: {
                type: Type.STRING,
                description: "The name of the ride-sharing service, like 'Uber', 'Ola', or 'inDrive'."
            },
            carType: {
                type: Type.STRING,
                description: "The type of car or service level, e.g., 'Go Sedan', 'Mini', 'Auto', 'Bike'."
            },
            price: {
                type: Type.NUMBER,
                description: "The estimated price for the ride in local currency."
            },
            etaMinutes: {
                type: Type.INTEGER,
                description: "The estimated time of arrival for the cab in minutes."
            },
             seats: {
                type: Type.INTEGER,
                description: "The maximum number of passengers the car can accommodate."
            },
            features: {
                type: Type.ARRAY,
                description: "A list of notable features for the cab, e.g., 'AC', 'Spacious', 'Electric', 'Top Rated'. For bikes, use 'Helmet provided'.",
                items: {
                    type: Type.STRING
                }
            },
            deepLinkUrl: {
                type: Type.STRING,
                description: "A generic URL to the service's website. E.g., 'https://www.uber.com'."
            },
        },
        required: ["serviceName", "carType", "price", "etaMinutes", "seats", "deepLinkUrl"],
    }
};


export const findCabs = async (pickup: string, dropoff: string, seats: number): Promise<CabOption[]> => {
    if (!process.env.API_KEY) {
        console.log("Using mock data as API_KEY is not available.");
        const filteredMocks = mockCabOptions.filter(cab => cab.seats >= seats);
        return new Promise(resolve => setTimeout(() => resolve(filteredMocks.sort((a,b) => a.price - b.price)), 1500));
    }
    
    try {
        const prompt = `
            You are a cab aggregation service. A user wants to travel from "${pickup}" to "${dropoff}" and needs a ride for ${seats} ${seats === 1 ? 'person' : 'people'}.
            Provide a list of available cabs from popular and niche services in India like Uber, Ola, inDrive, BluSmart, Quick Ride, and other local services that can accommodate at least ${seats} passengers.
            ${seats === 1 ? "Since the user is travelling alone, also include bike taxi options from services like Rapido, Uber Moto, and Ola Bike. For bikes, set seats to 1 and carType to 'Bike' or 'Moto'." : ""}
            Generate at least 5-7 realistic but fictional options with varying prices, car types, and ETAs.
            Include a 'features' array with 2-3 relevant tags for each cab, such as 'AC', 'Spacious', 'Electric', 'Eco-friendly', 'Top Rated', 'SUV', 'Carpool'. For bikes, you can use features like 'Helmet provided' or 'Quick commute'.
            For 'deepLinkUrl', use the main homepage URL for the corresponding service.
            Ensure the 'seats' property reflects the passenger capacity.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: cabOptionsSchema,
            },
        });

        const jsonText = response.text.trim();
        const cabData: CabOption[] = JSON.parse(jsonText);
        
        // Sort by price before returning
        return cabData.sort((a, b) => a.price - b.price);

    } catch (error) {
        console.error("Error fetching cab data from Gemini API:", error);
        // Fallback to mock data on API error
        const filteredMocks = mockCabOptions.filter(cab => cab.seats >= seats);
        return filteredMocks.sort((a, b) => a.price - b.price);
    }
};