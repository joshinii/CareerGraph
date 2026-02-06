/**
 * Mock skills taxonomy for Phase 0.
 */
export const skillsTaxonomy = {
  programming_languages: [
    'Java',
    'Python',
    'JavaScript',
    'TypeScript',
    'C++',
    'C#',
    'Go',
    'Rust',
    'PHP',
    'Ruby',
    'Kotlin',
    'Swift',
    'SQL',
    'HTML',
    'CSS',
    'Scala',
    'Groovy'
  ],
  frameworks: [
    'React',
    'Angular',
    'Vue.js',
    'Next.js',
    'Node.js',
    'Express',
    'Spring Boot',
    'Spring',
    'Django',
    'Flask',
    'FastAPI',
    'Laravel',
    'Ruby on Rails',
    'ASP.NET',
    'Hibernate',
    'Mockito',
    'JUnit',
    'Jasmine',
    'Jest',
    'Pytest',
    'NestJS',
    'Fastify'
  ],
  web_technologies: [
    'REST API',
    'RESTful APIs',
    'GraphQL',
    'SOAP',
    'WebSocket',
    'OAuth',
    'JWT',
    'SSO',
    'API Gateway',
    'Microservices',
    'Full Stack Development',
    'Web Applications',
    'API Development',
    'Authentication',
    'Authorization',
    'CORS',
    'HTTP/HTTPS'
  ],
  cloud_devops: [
    'AWS',
    'Microsoft Azure',
    'GCP',
    'Google Cloud Platform',
    'Docker',
    'Kubernetes',
    'Jenkins',
    'Git',
    'Bitbucket',
    'GitHub',
    'CI/CD',
    'Red Hat OpenShift',
    'Terraform',
    'CloudFormation',
    'Ansible',
    'EC2',
    'S3',
    'Lambda',
    'RDS',
    'VPC',
    'IAM',
    'CloudWatch',
    'GitLab CI',
    'GitHub Actions',
    'ArgoCD',
    'Helm'
  ],
  databases: [
    'SQL Server',
    'Oracle',
    'PostgreSQL',
    'MySQL',
    'MongoDB',
    'IBM DB2',
    'Redis',
    'Cassandra',
    'DynamoDB',
    'SQLite',
    'Elasticsearch',
    'Hadoop',
    'Apache Spark',
    'Data Pipelines',
    'ETL',
    'Data Engineering',
    'SQL Query Optimization'
  ],
  data_tools: [
    'Pandas',
    'NumPy',
    'Matplotlib',
    'Seaborn',
    'SciPy',
    'Scikit-learn',
    'TensorFlow',
    'PyTorch',
    'Jupyter',
    'Apache Airflow',
    'Snowflake',
    'BigQuery',
    'Data Analysis',
    'Statistical Analysis',
    'Machine Learning',
    'Deep Learning'
  ],
  monitoring: [
    'Splunk',
    'Dynatrace',
    'New Relic',
    'DataDog',
    'Prometheus',
    'Grafana',
    'ELK Stack',
    'Application Performance Monitoring',
    'Log Management',
    'Distributed Tracing'
  ],
  practices: [
    'Agile',
    'Scrum',
    'Kanban',
    'Test-Driven Development',
    'TDD',
    'Code Review',
    'Debugging',
    'System Design',
    'Problem Solving',
    'Object-Oriented Programming',
    'OOP',
    'Design Patterns',
    'Clean Code',
    'Software Architecture',
    'Technical Leadership',
    'Team Collaboration',
    'Communication',
    'Documentation',
    'Performance Optimization',
    'Security Best Practices',
    'SOLID Principles'
  ],
  tools_other: [
    'Maven',
    'Gradle',
    'npm',
    'Yarn',
    'Webpack',
    'Babel',
    'Docker Compose',
    'JIRA',
    'Confluence',
    'BitBucket Pipelines',
    'SonarQube',
    'Postman',
    'Swagger',
    'OpenAPI',
    'IntelliJ IDEA',
    'VS Code',
    'Visual Studio'
  ]
};

export function getAllSkills() {
  const allSkills = [];
  Object.values(skillsTaxonomy).forEach((skills) => {
    allSkills.push(...skills);
  });
  return [...new Set(allSkills)];
}

export function getSkillCategory(skillName) {
  for (const [category, skills] of Object.entries(skillsTaxonomy)) {
    if (skills.map((skill) => skill.toLowerCase()).includes(skillName.toLowerCase())) {
      return category.replace(/_/g, ' ');
    }
  }
  return 'other';
}
