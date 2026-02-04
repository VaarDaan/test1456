import { Award, Users, Wrench, Shield } from "lucide-react";

const features = [
  {
    icon: Wrench,
    title: "Expert Craftsmanship",
    description: "Skilled artisans with decades of experience in steel fabrication",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description: "Only the finest materials for lasting durability and elegance",
  },
  {
    icon: Users,
    title: "Custom Solutions",
    description: "Tailored designs to match your unique vision and requirements",
  },
  {
    icon: Shield,
    title: "Guaranteed Satisfaction",
    description: "We stand behind every piece we create with full warranty",
  },
];

export function AboutSection() {
  return (
    <section className="section-container">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Content */}
        <div>
          <span className="inline-block px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider bg-primary/10 text-primary mb-6">
            About Us
          </span>
          <h2 className="section-heading mb-6">
            Building Dreams with{" "}
            <span className="gold-text">Steel & Passion</span>
          </h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            At Satarupa Steel Furnitures, we believe in transforming raw steel into 
            works of art. Under the visionary leadership of{" "}
            <strong className="text-foreground">Bidyut Kumar Bera</strong>, our team 
            has been crafting premium steel solutions for over a decade.
          </p>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            From elegant interior railings to robust exterior structures, from 
            contemporary furniture to exclusive premium collections — every piece 
            reflects our commitment to excellence and attention to detail.
          </p>

          <div className="grid grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={feature.title} className={`fade-up fade-up-delay-${index + 1}`}>
                <div className="glass-card p-4 rounded-xl inline-flex mb-3">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-semibold mb-1">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="glass-card overflow-hidden rounded-2xl aspect-[3/4]">
              <img
                src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=500&fit=crop"
                alt="Steel fabrication work"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="glass-card overflow-hidden rounded-2xl aspect-square">
              <img
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&h=400&fit=crop"
                alt="Modern furniture design"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="space-y-4 pt-8">
            <div className="glass-card overflow-hidden rounded-2xl aspect-square">
              <img
                src="https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=400&h=400&fit=crop"
                alt="Interior steel work"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="glass-card overflow-hidden rounded-2xl aspect-[3/4]">
              <img
                src="https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400&h=500&fit=crop"
                alt="Premium steel furniture"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
