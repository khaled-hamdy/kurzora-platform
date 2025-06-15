
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, TrendingUp } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  stats: string;
  rating: number;
  profit: string;
  verified: boolean;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "Made $4,700 on the NVDA signal. Already covered my annual subscription 5x over. The 2:1 profit ratio is a game-changer.",
    author: "Sarah T.",
    role: "Day Trader",
    stats: "Pro user since 2023",
    rating: 5,
    profit: "+$18,400 profit this year",
    verified: true,
    avatar: "🧑‍💼"
  },
  {
    id: 2,
    quote: "Turned my $25k account into $37k in 8 months. The risk management is what sets Kurzora apart - I never risk more than 2%.",
    author: "Michael K.",
    role: "Swing Trader",
    stats: "Premium user since 2022",
    rating: 5,
    profit: "+48% account growth",
    verified: true,
    avatar: "👨‍💻"
  },
  {
    id: 3,
    quote: "Finally profitable after 3 years of losses. The filtered signals save me hours and the stop-loss discipline changed everything.",
    author: "James L.",
    role: "Part-time Trader",
    stats: "Elite user since 2023",
    rating: 5,
    profit: "From -$12k to +$8k this year",
    verified: true,
    avatar: "👩‍💼"
  },
  {
    id: 4,
    quote: "The options signals are pure gold. I've tripled my account size since subscribing. Best investment I've ever made!",
    author: "David Park",
    role: "Options Trader",
    stats: "Pro user since 2024",
    rating: 5,
    profit: "+40% this quarter",
    verified: true,
    avatar: "🧑‍🚀"
  },
  {
    id: 5,
    quote: "Real-time alerts and exceptional accuracy. The performance analytics help me track my progress and improve my strategies.",
    author: "Amanda L.",
    role: "Algorithmic Trader",
    stats: "Premium user since 2023",
    rating: 5,
    profit: "+47% in 6 months",
    verified: true,
    avatar: "👩‍🔬"
  }
];

const TestimonialCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000);
    return () => clearInterval(interval);
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-slate-600'}`}
      />
    ));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">Trusted by Successful Traders</h2>
        <p className="text-slate-400 text-lg">See how Kurzora is transforming trading careers worldwide</p>
      </div>

      <div className="relative">
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-6">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-2xl">
                          {testimonial.avatar}
                        </div>
                        {testimonial.verified && (
                          <div className="mt-2 text-center">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-emerald-900/50 text-emerald-300 border border-emerald-700">
                              ✓ Verified
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {renderStars(testimonial.rating)}
                        </div>
                        
                        <blockquote className="text-slate-200 text-lg mb-4 leading-relaxed">
                          "{testimonial.quote}"
                        </blockquote>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-white font-semibold">{testimonial.author}</div>
                            <div className="text-slate-400 text-sm">{testimonial.role}</div>
                            <div className="text-slate-500 text-xs mt-1">{testimonial.stats}</div>
                          </div>
                          
                          <div className="text-right">
                            <div className="flex items-center text-emerald-400 font-bold text-lg">
                              <TrendingUp className="h-4 w-4 mr-1" />
                              {testimonial.profit}
                            </div>
                            <div className="text-slate-400 text-xs">Performance</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-slate-800/80 border-slate-600 hover:bg-slate-700 text-white"
          onClick={prevTestimonial}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-slate-800/80 border-slate-600 hover:bg-slate-700 text-white"
          onClick={nextTestimonial}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex justify-center mt-8 space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? 'bg-emerald-400' : 'bg-slate-600'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialCarousel;
