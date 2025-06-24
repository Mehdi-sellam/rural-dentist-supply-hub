import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, MessageCircle, Phone, Mail } from 'lucide-react';

const FAQ = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqData = [
    {
      category: "Ordering & Payment",
      questions: [
        {
          question: "How do I place an order?",
          answer: "You can place orders through our website by adding items to your cart and checking out, or by contacting us directly via WhatsApp for immediate assistance."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept cash on delivery (COD) for all locations in Algeria. Online payment options including bank transfers are coming soon."
        },
        {
          question: "Do I need to create an account to order?",
          answer: "No, you can place your first order without creating an account. However, creating an account helps you track orders and reorder easily."
        }
      ]
    },
    {
      category: "Delivery & Shipping",
      questions: [
        {
          question: "Do you really deliver to rural areas?",
          answer: "Yes! We specialize in delivering to rural and remote areas across Algeria. We guarantee delivery within 48 hours to any location in the country."
        },
        {
          question: "What are the delivery charges?",
          answer: "Delivery is FREE for all orders above 5,000 DZD. For smaller orders, delivery charges vary by location but are kept minimal."
        },
        {
          question: "How can I track my order?",
          answer: "Once your order is confirmed, we'll send you tracking information via WhatsApp and SMS. You can also contact us anytime for updates."
        }
      ]
    },
    {
      category: "Products & Quality",
      questions: [
        {
          question: "Where do you source your products?",
          answer: "Our products are sourced from trusted manufacturers in Europe and Southeast Asia, ensuring high quality while maintaining competitive prices."
        },
        {
          question: "Do you offer product warranties?",
          answer: "Yes, all equipment comes with manufacturer warranties. Disposable items are guaranteed for quality and expiration dates."
        },
        {
          question: "Can I return products if I'm not satisfied?",
          answer: "We accept returns for equipment within 7 days if unused and in original packaging. Disposable items cannot be returned for hygiene reasons."
        }
      ]
    },
    {
      category: "Support & Contact",
      questions: [
        {
          question: "What languages do you support?",
          answer: "Our team provides support in Arabic, French, and English. Our website is also available in these three languages."
        },
        {
          question: "What are your business hours?",
          answer: "Our offices are open Sunday-Thursday 8AM-6PM, Friday 8AM-12PM. However, WhatsApp support is available 24/7 for urgent orders."
        },
        {
          question: "How quickly do you respond to inquiries?",
          answer: "WhatsApp messages are typically answered within 30 minutes during business hours. Email inquiries are answered within 24 hours."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-green-50 py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about ordering, delivery, and our services
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {faqData.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {categoryIndex + 1}
                </div>
                {category.category}
              </h2>
              
              <div className="space-y-4">
                {category.questions.map((item, questionIndex) => {
                  const globalIndex = categoryIndex * 10 + questionIndex;
                  const isOpen = openItems.includes(globalIndex);
                  
                  return (
                    <Card key={questionIndex} className="overflow-hidden">
                      <CardContent className="p-0">
                        <button
                          onClick={() => toggleItem(globalIndex)}
                          className="w-full p-6 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                        >
                          <span className="font-medium text-gray-900 pr-4">
                            {item.question}
                          </span>
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          )}
                        </button>
                        
                        {isOpen && (
                          <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                            {item.answer}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions section */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-br from-primary/10 to-accent/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Still have questions?
              </h3>
              <p className="text-gray-600 mb-6">
                Our team is here to help! Contact us through your preferred method.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="gap-2"
                  onClick={() => window.open('https://wa.me/213XXXXXXXXX?text=Hello! I have a question about your dental supplies.', '_blank')}
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp Chat
                </Button>
                <Button variant="outline" className="gap-2">
                  <Phone className="w-4 h-4" />
                  Call Us
                </Button>
                <Button variant="outline" className="gap-2">
                  <Mail className="w-4 h-4" />
                  Email Us
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
