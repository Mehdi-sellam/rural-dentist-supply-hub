
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, MapPin, Quote } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Dr. Amina Kassouri',
      nameAr: 'د. أمينة قصوري',
      location: 'Ouargla, Algeria',
      locationAr: 'ورقلة، الجزائر',
      image: '👩‍⚕️',
      rating: 5,
      text: "Finally, a supplier that understands rural dentistry! DentGo delivers quality materials right to our clinic in Ouargla. The composite kits are excellent quality and the delivery is surprisingly fast.",
      textAr: "أخيراً، مورد يفهم طب الأسنان الريفي! دنت غو يوصل مواد عالية الجودة مباشرة إلى عيادتنا في ورقلة. مجموعات الحشو ذات جودة ممتازة والتوصيل سريع بشكل مدهش.",
      specialty: "General Dentistry"
    },
    {
      id: 2,
      name: 'Dr. Youcef Benali',
      nameAr: 'د. يوسف بن علي',
      location: 'Tlemcen, Algeria',
      locationAr: 'تلمسان، الجزائر',
      image: '👨‍⚕️',
      rating: 5,
      text: "The surgical instruments from DentGo are professional grade. I've been ordering monthly bundles for 6 months now. Great prices and the WhatsApp ordering system is very convenient.",
      textAr: "الأدوات الجراحية من دنت غو بمستوى مهني. أطلب الحزم الشهرية منذ 6 أشهر الآن. أسعار رائعة ونظام الطلب عبر واتساب مريح جداً.",
      specialty: "Oral Surgery"
    },
    {
      id: 3,
      name: 'Dr. Sarah Meziane',
      nameAr: 'د. سارة مزيان',
      location: 'Béjaïa, Algeria',
      locationAr: 'بجاية، الجزائر',
      image: '👩‍⚕️',
      rating: 5,
      text: "As a female dentist in a smaller city, I appreciate the reliable service and quality products. The customer support speaks Arabic perfectly and they understand our specific needs in Algeria.",
      textAr: "كطبيبة أسنان في مدينة صغيرة، أقدر الخدمة الموثوقة والمنتجات عالية الجودة. خدمة العملاء تتحدث العربية بطلاقة ويفهمون احتياجاتنا المحددة في الجزائر.",
      specialty: "Pediatric Dentistry"
    },
    {
      id: 4,
      name: 'Dr. Mohamed Larbi',
      nameAr: 'د. محمد العربي',
      location: 'Ghardaïa, Algeria',
      locationAr: 'غرداية، الجزائر',
      image: '👨‍⚕️',
      rating: 5,
      text: "Exceptional service! They delivered dental equipment to our remote clinic when no other supplier would. The loyalty program is fantastic - we've already earned a free kit!",
      textAr: "خدمة استثنائية! وصلوا معدات الأسنان إلى عيادتنا النائية عندما لم يكن أي مورد آخر يريد ذلك. برنامج الولاء رائع - حصلنا بالفعل على مجموعة مجانية!",
      specialty: "Endodontics"
    }
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Dentists Across Algeria
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From Algiers to the Sahara, dental professionals rely on our quality and service
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                {/* Quote icon */}
                <Quote className="w-8 h-8 text-primary/20 mb-4" />
                
                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Testimonial text */}
                <blockquote className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.text}"
                </blockquote>

                {/* Arabic testimonial */}
                <blockquote className="text-gray-600 mb-6 text-sm rtl leading-relaxed bg-gray-50 p-3 rounded-lg">
                  "{testimonial.textAr}"
                </blockquote>

                {/* Doctor info */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-xl">
                    {testimonial.image}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                      <span className="text-sm text-gray-500 rtl">({testimonial.nameAr})</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="w-3 h-3" />
                      <span>{testimonial.location}</span>
                      <span className="text-gray-400">•</span>
                      <span className="rtl">{testimonial.locationAr}</span>
                    </div>
                    <p className="text-xs text-primary font-medium mt-1">{testimonial.specialty}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-12 p-8 bg-gradient-to-r from-primary/5 to-green-50 rounded-2xl">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Join 500+ Satisfied Dentists
          </h3>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Experience the difference of working with a supplier that truly understands Algerian dental practice needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Start Shopping Today
            </button>
            <button className="border border-primary text-primary px-8 py-3 rounded-lg font-medium hover:bg-primary/5 transition-colors">
              Request Catalog
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
