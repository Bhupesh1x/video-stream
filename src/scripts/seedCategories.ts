import { db } from "@/db";
import { categories } from "@/db/schema";

const categoriesOptions = [
  "People and blogs",
  "Film and animation",
  "Music",
  "Gaming",
  "Comedy",
  "Education",
  "Entertainment",
  "Pets and animals",
  "Hot-to and style",
  "Cars and vehicles",
  "News and politics",
  "Science and technology",
  "Sports",
  "Travel and events",
];

async function main() {
  console.log("Starting seeding categories...");

  try {
    const values = categoriesOptions.map((category) => ({
      name: category,
      description: `Videos related to ${category.toLowerCase()}`,
    }));

    await db.insert(categories).values(values);

    console.log("Categories seeded successfully");
  } catch (error) {
    console.error("Error seeding categories", error);
  }
}

main();
