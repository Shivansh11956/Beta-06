/**
 * Generates a semantic similarity matrix for a list of tags.
 * @returns {Map<string, Map<string, number>>} A 2D Map where matrix.get(tagA).get(tagB) returns a score from 0.0 to 1.0.
 */
function generateSimilarityMatrix() {
    
    // 1. Define all tags from your image
    const tags = [
        "Artificial Intelligence", "Machine Learning", "Web Development", "Mobile Development", "Data Science", "Cybersecurity",
        "Blockchain", "Cloud Computing", "DevOps", "UI/UX Design", "Product Management", "Digital Marketing", "Entrepreneurship",
        "Startups", "Business Strategy", "Finance", "Sustainability", "Healthcare Tech", "EdTech", "Gaming", "AR/VR", "IoT",
        "Robotics", "Photography", "Writing", "JavaScript", "Python", "Java", "React", "Node.js", "SQL", "MongoDB", "AWS",
        "Docker", "Git", "Figma", "Photoshop", "Excel", "PowerPoint", "Public Speaking", "Leadership", "Project Management",
        "Research", "Data Analysis", "Content Writing", "Social Media", "SEO"
    ];

    // 2. Define high-priority scores for specific pairs
    // These override cluster logic.
    // We use a helper function to create a sorted key to handle (A,B) and (B,A) pairs.
    const specificScores = new Map();
    const setScore = (tagA, tagB, score) => {
        const key = [tagA, tagB].sort().join('|');
        specificScores.set(key, score);
    };

    // Very High Similarity (0.8 - 0.9)
    setScore("Artificial Intelligence", "Machine Learning", 0.9);
    setScore("Artificial Intelligence", "Data Science", 0.8);
    setScore("Machine Learning", "Data Science", 0.85);
    setScore("Data Science", "Data Analysis", 0.8);
    setScore("UI/UX Design", "Figma", 0.9);
    setScore("Digital Marketing", "SEO", 0.9);
    setScore("Web Development", "JavaScript", 0.8);
    setScore("JavaScript", "React", 0.8);
    setScore("JavaScript", "Node.js", 0.8);
    setScore("Cloud Computing", "AWS", 0.8);
    setScore("DevOps", "Cloud Computing", 0.8);
    setScore("DevOps", "Docker", 0.7);
    setScore("Entrepreneurship", "Startups", 0.8);
    setScore("Photography", "Photoshop", 0.7);

    // Medium-High Similarity (0.6 - 0.7)
    setScore("SQL", "MongoDB", 0.6); // Both databases
    setScore("SQL", "Data Analysis", 0.7);
    setScore("Python", "Data Science", 0.7);
    setScore("Python", "Machine Learning", 0.7);
    setScore("Python", "Web Development", 0.6);
    setScore("UI/UX Design", "Photoshop", 0.6);
    setScore("Digital Marketing", "Social Media", 0.7);
    setScore("Digital Marketing", "Content Writing", 0.6);
    setScore("Writing", "Content Writing", 0.7);
    setScore("Excel", "PowerPoint", 0.7); // Office suite
    setScore("Leadership", "Project Management", 0.6);
    setScore("Leadership", "Business Strategy", 0.7);

    // Low Similarity (Crucial Overrides)
    setScore("Java", "JavaScript", 0.2); // Common confusion, but not very similar

    // 3. Define logical clusters
    const clusters = {
        ai: ["Artificial Intelligence", "Machine Learning", "Data Science", "Data Analysis", "Research", "Robotics"],
        dev: ["Web Development", "Mobile Development", "JavaScript", "Python", "Java", "React", "Node.js", "SQL", "MongoDB", "Git"],
        cloud: ["Cloud Computing", "DevOps", "AWS", "Docker", "Cybersecurity"],
        design: ["UI/UX Design", "Figma", "Photoshop"],
        business: ["Product Management", "Entrepreneurship", "Startups", "Business Strategy", "Finance", "Leadership", "Project Management", "Public Speaking"],
        marketing: ["Digital Marketing", "Content Writing", "Social Media", "SEO"],
        creative: ["Photography", "Writing", "Gaming", "AR/VR"],
        tech: ["Blockchain", "Sustainability", "Healthcare Tech", "EdTech", "IoT"],
        tools: ["Excel", "PowerPoint"]
    };

    // Create a reverse map for quick cluster lookup
    const tagClusterMap = new Map();
    for (const clusterName in clusters) {
        for (const tag of clusters[clusterName]) {
            tagClusterMap.set(tag, clusterName);
        }
    }

    // 4. Define similarity scores
    const SAME_CLUSTER_SCORE = 0.5;
    const DEFAULT_SCORE = 0.1; // Default for unrelated tags

    // 5. Build the matrix
    const matrix = new Map();
    for (const tagA of tags) {
        const tagBMap = new Map();
        for (const tagB of tags) {
            
            // 5.1. Identical tags
            if (tagA === tagB) {
                tagBMap.set(tagB, 1.0);
                continue;
            }

            // 5.2. Check for a specific, predefined score
            const sortedKey = [tagA, tagB].sort().join('|');
            if (specificScores.has(sortedKey)) {
                tagBMap.set(tagB, specificScores.get(sortedKey));
                continue;
            }

            // 5.3. Check if they are in the same cluster
            const clusterA = tagClusterMap.get(tagA);
            const clusterB = tagClusterMap.get(tagB);
            
            if (clusterA && clusterA === clusterB) {
                tagBMap.set(tagB, SAME_CLUSTER_SCORE);
                continue;
            }

            // 5.4. Assign default low score
            tagBMap.set(tagB, DEFAULT_SCORE);
        }
        matrix.set(tagA, tagBMap);
    }
    
    return matrix;
}

const similarityMatrix = generateSimilarityMatrix();