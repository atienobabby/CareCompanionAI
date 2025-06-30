export class HealthAI {
  private symptomDatabase = {
    headache: {
      severity: 'mild',
      causes: ['tension', 'dehydration', 'stress', 'eye strain'],
      recommendations: ['Rest in a quiet, dark room', 'Stay hydrated', 'Apply cold compress'],
    },
    fever: {
      severity: 'moderate',
      causes: ['infection', 'inflammation', 'immune response'],
      recommendations: ['Monitor temperature regularly', 'Stay hydrated', 'Rest', 'Consider fever reducer'],
    },
    cough: {
      severity: 'mild',
      causes: ['cold', 'allergies', 'irritation'],
      recommendations: ['Stay hydrated', 'Use honey for throat relief', 'Avoid irritants'],
    },
    fatigue: {
      severity: 'mild',
      causes: ['lack of sleep', 'stress', 'poor nutrition'],
      recommendations: ['Ensure adequate sleep', 'Eat balanced meals', 'Light exercise'],
    },
    nausea: {
      severity: 'moderate',
      causes: ['food poisoning', 'motion sickness', 'medication'],
      recommendations: ['Stay hydrated with small sips', 'Eat bland foods', 'Rest'],
    },
    dizziness: {
      severity: 'moderate',
      causes: ['dehydration', 'low blood sugar', 'inner ear issues'],
      recommendations: ['Sit or lie down immediately', 'Stay hydrated', 'Avoid sudden movements'],
    },
    chest_pain: {
      severity: 'severe',
      causes: ['heart issues', 'lung problems', 'muscle strain'],
      recommendations: ['Seek immediate medical attention', 'Do not ignore chest pain', 'Call emergency services'],
    },
    breathing: {
      severity: 'severe',
      causes: ['asthma', 'pneumonia', 'heart problems'],
      recommendations: ['Seek immediate medical attention', 'Use prescribed inhaler if available', 'Call emergency services'],
    },
  };

  async processMessage(message: string): Promise<string> {
    const lowerMessage = message.toLowerCase();
    
    // Health-related keywords
    const healthKeywords = ['pain', 'hurt', 'ache', 'sick', 'feel', 'symptom', 'temperature', 'fever', 'cough'];
    
    if (healthKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return this.generateHealthResponse(message);
    }
    
    // General health advice
    if (lowerMessage.includes('healthy') || lowerMessage.includes('wellness')) {
      return "Maintaining good health involves regular exercise, balanced nutrition, adequate sleep, and regular check-ups with healthcare providers. Is there a specific aspect of health you'd like to know more about?";
    }
    
    // Emergency situations
    if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent')) {
      return "If you're experiencing a medical emergency, please call emergency services immediately (911 in the US). For non-emergency health concerns, I'm here to provide general information and guidance.";
    }
    
    // Default response
    return "I'm here to help with general health information and guidance. You can ask me about symptoms, general health advice, or describe how you're feeling. Remember, I provide general information only - always consult healthcare professionals for medical advice.";
  }

  private generateHealthResponse(message: string): string {
    const responses = [
      "I understand you're concerned about your health. Can you describe your symptoms in more detail?",
      "Thank you for sharing that with me. While I can provide general information, it's important to consult with a healthcare professional for proper diagnosis and treatment.",
      "I'm here to help with general health information. Based on what you've shared, I recommend staying hydrated, getting rest, and monitoring your symptoms.",
      "Health concerns can be worrying. If your symptoms persist or worsen, please consider contacting a healthcare provider.",
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  async analyzeSymptoms(symptoms: string[]): Promise<any>  {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    let maxSeverity = 'mild';
    const allRecommendations: string[] = [];
    const causes: string[] = [];
    
    symptoms.forEach(symptom => {
      const symptomData = this.symptomDatabase[symptom as keyof typeof this.symptomDatabase];
      if (symptomData) {
        // Determine highest severity
        if (symptomData.severity === 'severe') {
          maxSeverity = 'severe';
        } else if (symptomData.severity === 'moderate' && maxSeverity !== 'severe') {
          maxSeverity = 'moderate';
        }
        
        // Collect recommendations
        allRecommendations.push(...symptomData.recommendations);
        causes.push(...symptomData.causes);
      }
    });
    
    // Remove duplicates
    const uniqueRecommendations = [...new Set(allRecommendations)];
    const uniqueCauses = [...new Set(causes)];
    
    // Generate summary based on severity
    let summary = '';
    switch (maxSeverity) {
      case 'mild':
        summary = 'Your symptoms appear to be mild. Following the recommendations below should help you feel better.';
        break;
      case 'moderate':
        summary = 'Your symptoms are moderate and should be monitored. Consider consulting a healthcare provider if they persist.';
        break;
      case 'severe':
        summary = 'Your symptoms may be serious. Please seek immediate medical attention.';
        break;
    }
    
    return {
      severity: maxSeverity,
      summary,
      recommendations: uniqueRecommendations.slice(0, 5), // Limit to 5 recommendations
      possibleCauses: uniqueCauses.slice(0, 3), // Limit to 3 causes
      disclaimer: 'This analysis is for informational purposes only and should not replace professional medical advice.',
    };
  }
}