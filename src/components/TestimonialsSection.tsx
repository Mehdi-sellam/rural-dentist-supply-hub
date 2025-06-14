
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, MapPin, Quote } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Dr. Amina Kassouri',
      nameAr: 'د. أمينة قصوري',
      location: 'Ouargla, Algérie',
      locationAr: 'ورقلة، الجزائر',
      image: '👩‍⚕️',
      rating: 5,
      text: "Enfin, un fournisseur qui comprend la dentisterie rurale ! DentGo livre des matériaux de qualité directement dans notre clinique à Ouargla. Les kits de composite sont d'excellente qualité et la livraison est étonnamment rapide.",
      textAr: "أخيراً، مورد يفهم طب الأسنان الريفي! دنت غو يوصل مواد عالية الجودة مباشرة إلى عيادتنا في ورقلة. مجموعات الحشو ذات جودة ممتازة والتوصيل سريع بشكل مدهش.",
      specialty: "Dentisterie Générale"
    },
    {
      id: 2,
      name: 'Dr. Youcef Benali',
      nameAr: 'د. يوسف بن علي',
      location: 'Tlemcen, Algérie',
      locationAr: 'تلمسان، الجزائر',
      image: '👨‍⚕️',
      rating: 5,
      text: "Les instruments chirurgicaux de DentGo sont de niveau professionnel. Je commande des kits mensuels depuis 6 mois maintenant. Excellents prix et le système de commande WhatsApp est très pratique.",
      textAr: "الأدوات الجراحية من دنت غو بمستوى مهني. أطلب الحزم الشهرية منذ 6 أشهر الآن. أسعار رائعة ونظام الطلب عبر واتساب مريح جداً.",
      specialty: "Chirurgie Orale"
    },
    {
      id: 3,
      name: 'Dr. Sarah Meziane',
      nameAr: 'د. سارة مزيان',
      location: 'Béjaïa, Algérie',
      locationAr: 'بجاية، الجزائر',
      image: '👩‍⚕️',
      rating: 5,
      text: "En tant que dentiste femme dans une petite ville, j'apprécie le service fiable et les produits de qualité. Le support client parle parfaitement l'arabe et comprend nos besoins spécifiques en Algérie.",
      textAr: "كطبيبة أسنان في مدينة صغيرة، أقدر الخدمة الموثوقة والمنتجات عالية الجودة. خدمة العملاء تتحدث العربية بطلاقة ويفهمون احتياجاتنا المحددة في الجزائر.",
      specialty: "Dentisterie Pédiatrique"
    },
    {
      id: 4,
      name: 'Dr. Mohamed Larbi',
      nameAr: 'د. محمد العربي',
      location: 'Ghardaïa, Algérie',
      locationAr: 'غرداية، الجزائر',
      image: '👨‍⚕️',
      rating: 5,
      text: "Service exceptionnel ! Ils ont livré l'équipement dentaire à notre clinique isolée quand aucun autre fournisseur ne le voulait. Le programme de fidélité est fantastique - nous avons déjà gagné un kit gratuit !",
      textAr: "خدمة استثنائية! وصلوا معدات الأسنان إلى عيادتنا النائية عندما لم يكن أي مورد آخر يريد ذلك. برنامج الولاء رائع - حصلنا بالفعل على مجموعة مجانية!",
      specialty: "Endodontie"
    }
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Approuvé par les Dentistes à travers l'Algérie
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            D'Alger au Sahara, les professionnels dentaires comptent sur notre qualité et notre service
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
            Rejoignez 500+ Dentistes Satisfaits
          </h3>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Découvrez la différence de travailler avec un fournisseur qui comprend vraiment les besoins de la pratique dentaire algérienne.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Commencer à Acheter Aujourd'hui
            </button>
            <button className="border border-primary text-primary px-8 py-3 rounded-lg font-medium hover:bg-primary/5 transition-colors">
              Demander le Catalogue
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
