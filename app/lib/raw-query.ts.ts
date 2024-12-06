import supabase from "./supabase-client";

//const query = async () => {
//    const dropQuery = `
//DROP TABLE IF EXISTS testing;
//`;
//    const { error: dropError } = await supabase.rpc('sql', { q: dropQuery });
//    if (dropError) {
//        console.error('Error dropping table:', dropError.message);
//        return;
//    }
//    console.log('Table dropped successfully (if it existed).');
//
//    const createQuery = `
//CREATE TABLE items (
//id SERIAL PRIMARY KEY,
//name TEXT NOT NULL,
//created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//);
//`;
//    const { error: createError } = await supabase.rpc('sql', { q: createQuery });
//    if (createError) {
//        console.error('Error creating table:', createError.message);
//        return;
//    }
//    console.log('Table created successfully.');
//};

const query = async (command: string) => {
    const { data, error } = await supabase
        .rpc('sql', { sql: command })

    if (error) {
        console.error('Error:', error.message);
        return;
    }
    return data;
};

export default query
