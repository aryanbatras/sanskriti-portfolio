export const personalInfo = {
  name: "Sanskriti Gupta",
  title: "AI/ML Researcher & Writer",
  tagline: "Always up for a meaningful challenge and a cup of code",
  email: "sanskriti12340@gmail.com",
  phone: "+91 775-302-1098",
  location: "Gwalior, Madhya Pradesh",

  photo: "/sanskriti-gupta.png",

  introduction: `I build speech intelligibility models and deep learning systems. Currently a research intern at IIT Jammu, working on non-intrusive speech assessment using self-supervised Whisper representations and Spectro-Temporal Modulation features.`,

  about: [
    `I am a computer science and design student at Madhav Institute of Technology and Science, Gwalior. My research focuses on speech intelligibility prediction, deep learning, and the space where language meets code. I think of myself as a curious kid who never stopped asking why.`,
    `Before my research at IIT Jammu, I developed a machine learning pipeline to detect fraudulent job postings at 3Skill, and built a real-time image captioning application called VisionSense. I have also written technical content for Codeveda and creative pieces for FrameFlicks.`,
    `Outside of AI research, I write poetry and short stories, solve data structures and algorithms problems, and I am always looking for the next meaningful challenge.`,
  ],

  writingIntro: `The thread that runs through everything I do is curiosity. I ask why until I reach the bottom of it. That question is what drove me from competitive programming to deep learning research to writing poetry. All of it is the same thing: trying to understand.`,

  pullQuote: `Always up for a challenge and a cup of coffee`,

  work: [
    {
      role: "Research Intern",
      organization: "IIT Jammu",
      logo: "/iitjammu_logo.jpeg",
      year: "Jun 2026 - Aug 2026",
      description: [
        "Developed a non-intrusive speech intelligibility prediction framework using self-supervised speech representations from Whisper and Wavelet Scattering Transform features.",
        "Engineered acoustic feature extraction pipelines with Gammatone filterbanks, Whisper embeddings, and PyTorch-based deep learning models for intelligibility assessment.",
        "Achieved Development RMSE of 21.62, surpassing all reproduced baselines on the evaluation dataset.",
      ],
    },
    {
      role: "AI/ML Intern",
      organization: "3Skill",
      logo: "/3_skill_logo.jpeg",
      year: "May 2026 - Jun 2026",
      description: [
        "Built a machine learning pipeline to detect fraudulent job postings using structured job attributes and textual features extracted from job descriptions and company profiles.",
        "Performed data preprocessing, text cleaning, feature engineering, and TF-IDF vectorization across multiple classification models including Logistic Regression and Naive Bayes.",
      ],
    },
    {
      role: "Technical Content Writer",
      organization: "Codeveda",
      logo: "/code_veda_logo.jpeg",
      year: "Jun 2026 - Jul 2026",
      description: [
        "Wrote technical content on AI and ML topics, including Large Language Models and their real-world applications.",
      ],
    },
    {
      role: "Creative Writer",
      organization: "FrameFlicks",
      logo: "/frame_flicks_logo.jpeg",
      year: "Jul 2025 - Present",
      description: [
        "Write poetry, humor pieces, and short stories. FrameFlicks is a creative outlet that keeps my writing sharp and my thinking flexible.",
      ],
    },
  ],

  projects: [
    {
      title: "Speech Intelligibility Prediction Framework",
      tech: "Python, PyTorch, Whisper, MLP",
      description:
        "Designed and implemented a speech intelligibility prediction system using self-supervised Whisper representations and Spectro-Temporal Modulation features. Development RMSE of 21.62, surpassing all reproduced baselines.",
      url: null,
    },
    {
      title: "VisionSense",
      tech: "JavaScript, Image-to-Description",
      description:
        "Image-to-description application that converts images into meaningful text descriptions using computer vision and language models.",
      url: "https://github.com/sanskriti231/VisionSense",
    },
    {
      title: "Fraud Detection Pipeline",
      tech: "Python, Scikit-learn, NLP",
      description:
        "Machine learning pipeline for detecting fraudulent job postings. Combined structured job attributes with TF-IDF vectorized text features across multiple classifiers.",
      url: null,
    },
    {
      title: "PDF to Summary",
      tech: "HTML",
      description:
        "An interactive learning tool that converts PDF documents into concise summaries, making studying and research more efficient.",
      url: "https://github.com/sanskriti231/pdf-to-summary",
    },
    {
      title: "Binary Classification — Cats vs Dogs",
      tech: "Python, CNN",
      description:
        "Convolutional Neural Network to classify images as cats or dogs, demonstrating deep learning fundamentals in computer vision.",
      url: "https://github.com/sanskriti231/binary-classification-cats-vs-dogs",
    },
    {
      title: "Classify Digits",
      tech: "Jupyter Notebook",
      description:
        "Handwritten digit classification using machine learning techniques on the MNIST dataset.",
      url: "https://github.com/sanskriti231/classifyDigits",
    },
    {
      title: "Slide Tile",
      tech: "Python",
      description:
        "A sliding tile puzzle game implementing search algorithms and heuristic-based problem solving.",
      url: "https://github.com/sanskriti231/slide-tile",
    },
    {
      title: "Linear & Logistic Regression",
      tech: "Python, ML",
      description:
        "Implementation of Linear and Logistic Regression machine learning algorithms from scratch without using scikit-learn.",
      url: "https://github.com/sanskriti231/Implementation-of-Linear-and-Logistic-Regression",
    },
    {
      title: "Weather Application",
      tech: "CSS, Web Technologies",
      description:
        "A weather application built as a web technologies project, displaying real-time weather data with a clean interface.",
      url: "https://github.com/sanskriti231/Weather-Application",
    },
    {
      title: "Tic Tac Toe — Minimax",
      tech: "Python, Pygame",
      description:
        "Interactive desktop game with a computer opponent using the Minimax algorithm for optimal play, with an intuitive Pygame interface.",
      url: "https://github.com/sanskriti231/tic-tac-toe-minimax",
    },
    {
      title: "Chess Game",
      tech: "Java",
      description:
        "A chess game implementation in Java with full game logic and piece movement rules.",
      url: "https://github.com/sanskriti231/Chess-game",
    },
    {
      title: "Online Crime Report Management",
      tech: "PHP",
      description:
        "College project for online crime report management — a web-based system for filing and tracking crime reports.",
      url: "https://github.com/sanskriti231/Online-Crime-Report-management-System",
    },
    {
      title: "Snake Game",
      tech: "Python",
      description:
        "The classic snake game — a terminal-based implementation demonstrating game loops and state management.",
      url: "https://github.com/sanskriti231/Snake-game",
    },
  ],

  skills: [
    {
      category: "AI & Machine Learning",
      items: ["NLP", "Computer Vision", "Deep Learning", "Neural Networks", "PyTorch", "TensorFlow", "Scikit-learn", "Speech Processing"],
    },
    {
      category: "Languages & Core CS",
      items: ["Python", "C++", "SQL", "Data Structures", "Algorithms", "OOP", "System Design"],
    },
    {
      category: "Developer Tools",
      items: ["FastAPI", "REST APIs", "MongoDB", "GitHub", "Linux", "Google Cloud", "Hugging Face", "Kaggle", "Jupyter Notebook"],
    },
  ],

  education: [
    {
      degree: "B.Tech in Computer Science and Design",
      school: "Madhav Institute of Technology and Science, Gwalior",
      logo: "/madhav_institute_of_technology_and_science_gole_ka_mandir_po_residency_gwalior_474005_logo.jpeg",
      year: "2023 - 2027",
      detail: "SGPA: 8.55",
    },
    {
      degree: "Grade 12 (CBSE)",
      school: "Kendriya Vidyalaya",
      logo: "/kendriya_vidyala.jpeg",
      year: "2022",
      detail: "91.6%",
    },
    {
      degree: "Grade 10 (ICSE)",
      school: "St. Joseph Vaz",
      logo: null,
      year: "2020",
      detail: "95.8% (Top 3 in district)",
    },
  ],

  certifications: [
    "Advanced Machine Learning Algorithms \u2014 DeepLearning.AI, Stanford University (Apr 2026)",
    "Supervised Machine Learning: Regression and Classification \u2014 Stanford, DeepLearning.AI (Nov 2025)",
  ],

  achievements: [
    "LeetCode rating: 1652 | 540+ DSA problems solved",
    "2+ years experience in C++ through competitive programming and OOP",
    "Research intern at IIT Jammu | Summer Research Internship",
    "100% grade in Andrew Ng\u2019s Advanced Machine Learning Algorithms course",
  ],

  socials: {
    linkedin: "https://linkedin.com/in/sanskriti-gupta-uno/",
    github: "https://github.com/sanskriti231",
    leetcode: "https://leetcode.com/u/sanskriti12340/",
  },
};
