/**
 * MOCK SKILLS TAXONOMY
 * 
 * Curated subset of technical skills for MVP testing
 * Based on ESCO framework structure
 * 
 * This covers:
 * - Programming Languages
 * - Web/Backend Frameworks
 * - Cloud & DevOps
 * - Databases
 * - Tools & Platforms
 * - Soft Skills & Practices
 * 
 * Total: ~200 skills across 8 categories
 */

export const skillsTaxonomy = {
  // PROGRAMMING LANGUAGES
  programming_languages: [
    "Java",
    "Python",
    "JavaScript",
    "TypeScript",
    "C++",
    "C#",
    "Go",
    "Rust",
    "PHP",
    "Ruby",
    "Kotlin",
    "Swift",
    "SQL",
    "HTML",
    "CSS",
    "Scala",
    "Groovy"
  ],

  // WEB & BACKEND FRAMEWORKS
  frameworks: [
    "React",
    "Angular",
    "Vue.js",
    "Next.js",
    "Node.js",
    "Express",
    "Spring Boot",
    "Spring",
    "Django",
    "Flask",
    "FastAPI",
    "Laravel",
    "Ruby on Rails",
    "ASP.NET",
    "Hibernate",
    "Mockito",
    "JUnit",
    "Jasmine",
    "Jest",
    "Pytest",
    "NestJS",
    "Fastify"
  ],

  // WEB & API TECHNOLOGIES
  web_technologies: [
    "REST API",
    "RESTful APIs",
    "GraphQL",
    "SOAP",
    "WebSocket",
    "OAuth",
    "JWT",
    "SSO",
    "API Gateway",
    "Microservices",
    "Full Stack Development",
    "Web Applications",
    "API Development",
    "Authentication",
    "Authorization",
    "CORS",
    "HTTP/HTTPS"
  ],

  // CLOUD & DEVOPS
  cloud_devops: [
    "AWS",
    "Microsoft Azure",
    "GCP",
    "Google Cloud Platform",
    "Docker",
    "Kubernetes",
    "Jenkins",
    "Git",
    "Bitbucket",
    "GitHub",
    "CI/CD",
    "Red Hat OpenShift",
    "Terraform",
    "CloudFormation",
    "Ansible",
    "EC2",
    "S3",
    "Lambda",
    "RDS",
    "VPC",
    "IAM",
    "CloudWatch",
    "GitLab CI",
    "GitHub Actions",
    "ArgoCD",
    "Helm"
  ],

  // DATABASES & DATA
  databases: [
    "SQL Server",
    "Oracle",
    "PostgreSQL",
    "MySQL",
    "MongoDB",
    "IBM DB2",
    "Redis",
    "Cassandra",
    "DynamoDB",
    "SQLite",
    "Elasticsearch",
    "Hadoop",
    "Apache Spark",
    "Data Pipelines",
    "ETL",
    "Data Engineering",
    "SQL Query Optimization"
  ],

  // DATA SCIENCE & ANALYSIS
  data_tools: [
    "Pandas",
    "NumPy",
    "Matplotlib",
    "Seaborn",
    "SciPy",
    "Scikit-learn",
    "TensorFlow",
    "PyTorch",
    "Jupyter",
    "Apache Airflow",
    "Snowflake",
    "BigQuery",
    "Data Analysis",
    "Statistical Analysis",
    "Machine Learning",
    "Deep Learning"
  ],

  // MONITORING & OBSERVABILITY
  monitoring: [
    "Splunk",
    "Dynatrace",
    "New Relic",
    "DataDog",
    "Prometheus",
    "Grafana",
    "ELK Stack",
    "Application Performance Monitoring",
    "Log Management",
    "Distributed Tracing"
  ],

  // DEVELOPMENT PRACTICES & SOFT SKILLS
  practices: [
    "Agile",
    "Scrum",
    "Kanban",
    "Test-Driven Development",
    "TDD",
    "Code Review",
    "Debugging",
    "System Design",
    "Problem Solving",
    "Object-Oriented Programming",
    "OOP",
    "Design Patterns",
    "Clean Code",
    "Software Architecture",
    "Technical Leadership",
    "Team Collaboration",
    "Communication",
    "Documentation",
    "Performance Optimization",
    "Security Best Practices",
    "SOLID Principles"
  ],

  // ADDITIONAL TOOLS & TECHNOLOGIES
  tools_other: [
    "Maven",
    "Gradle",
    "npm",
    "Yarn",
    "Webpack",
    "Babel",
    "Docker Compose",
    "JIRA",
    "Confluence",
    "BitBucket Pipelines",
    "SonarQube",
    "Postman",
    "Swagger",
    "OpenAPI",
    "IntelliJ IDEA",
    "VS Code",
    "Visual Studio"
  ]
};

/**
 * Helper functions to work with taxonomy
 */

export function getAllSkills() {
  const allSkills = [];
  Object.values(skillsTaxonomy).forEach((categorySkills) => {
    allSkills.push(...categorySkills);
  });
  return [...new Set(allSkills)]; // Remove duplicates
}

export function getSkillCategory(skillName) {
  for (const [category, skills] of Object.entries(skillsTaxonomy)) {
    if (skills.map(s => s.toLowerCase()).includes(skillName.toLowerCase())) {
      return category.replace(/_/g, ' ');
    }
  }
  return 'other';
}

export function getAllCategories() {
  return Object.keys(skillsTaxonomy).map(cat => ({
    key: cat,
    label: cat.replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  }));
}

/**
 * Example usage:
 * 
 * const allSkills = getAllSkills(); // Returns all ~200 skills
 * const category = getSkillCategory('React'); // Returns 'frameworks'
 * const categories = getAllCategories(); // Returns all category names
 */
