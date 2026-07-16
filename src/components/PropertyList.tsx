import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Bed, Bath, Square, X, Check, Loader2, Play, Video, Search, ChevronDown, Filter } from 'lucide-react';
import { getProperties, Property } from '../services/propertyService';

const PROPERTY_TYPES = ['all', 'apartment', 'house', 'villa', 'land', 'commercial'];

const INITIAL_PROPERTIES: Property[] = [
  {
    title: "The Glass Pavilion",
    location: "Beverly Hills, CA",
    price: "$12,500,000",
    beds: 5,
    baths: 6,
    sqft: "8,400",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800",
    description: "A masterpiece of modern architecture, the Glass Pavilion offers seamless indoor-outdoor living with floor-to-ceiling glass walls and panoramic city views. This estate features a private art gallery, a 100-foot infinity pool, and a state-of-the-art home theater.",
    amenities: ["Infinity Pool", "Art Gallery", "Home Theater", "Wine Cellar", "Smart Home System"],
    type: "villa",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1600607687940-4ad236f7570a?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6f3ea?auto=format&fit=crop&q=80&w=800"
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    title: "Azure Cliffside Villa",
    location: "Malibu, CA",
    price: "$18,900,000",
    beds: 6,
    baths: 8,
    sqft: "12,200",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
    description: "Perched on a private bluff overlooking the Pacific, Azure is the epitome of coastal luxury. Inspired by Mediterranean aesthetics, the villa boasts a private beach access, a professional-grade chef's kitchen, and a wellness spa with a sauna and steam room.",
    amenities: ["Private Beach", "Wellness Spa", "Chef's Kitchen", "Elevator", "Guest House"],
    type: "villa",
    gallery: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    title: "Modernist Sanctuary",
    location: "Aspen, CO",
    price: "$9,750,000",
    beds: 4,
    baths: 5,
    sqft: "6,800",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=800",
    description: "A serene retreat nestled in the heart of the Rockies. The Modernist Sanctuary combines raw natural materials like cedar and stone with sleek, contemporary lines. Features include a heated outdoor lounge, a ski-in/ski-out mudroom, and a double-height great room.",
    amenities: ["Ski-in/Ski-out", "Heated Lounge", "Stone Fireplace", "Library", "Gym"],
    type: "house",
    gallery: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    title: "The Obsidian House",
    location: "Joshua Tree, CA",
    price: "$4,200,000",
    beds: 3,
    baths: 3,
    sqft: "3,200",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
    description: "A brutalist masterpiece in the high desert. The Obsidian House is a study in shadow and light, featuring charred wood exteriors and polished concrete interiors that stay cool in the desert heat.",
    amenities: ["Stargazing Deck", "Saltwater Pool", "Solar Power", "Zen Garden", "Outdoor Kitchen"],
    type: "house",
    gallery: [
      "https://images.unsplash.com/photo-1449156001437-3a1661dc926b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    title: "Emerald Lake Estate",
    location: "Lake Tahoe, NV",
    price: "$22,000,000",
    beds: 8,
    baths: 10,
    sqft: "15,500",
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800",
    description: "A sprawling waterfront estate with 200 feet of private beach. This lodge-style mansion features a grand ballroom, a private dock, and a 12-car garage for the ultimate collector.",
    amenities: ["Private Dock", "Grand Ballroom", "Wine Grotto", "Bowling Alley", "Home Office"],
    type: "villa",
    gallery: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    title: "Skyline Penthouse",
    location: "New York, NY",
    price: "$35,000,000",
    beds: 4,
    baths: 5,
    sqft: "5,400",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800",
    description: "The crown jewel of Manhattan. This triplex penthouse offers 360-degree views of Central Park and the city skyline, with a private rooftop terrace and an internal glass elevator.",
    amenities: ["Rooftop Terrace", "Private Elevator", "Concierge", "Library", "Sauna"],
    type: "apartment",
    gallery: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=800"
    ]
  }
];

export default function PropertyList({ id }: { id?: string }) {
  const { t } = useTranslation();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [hoveredProperty, setHoveredProperty] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getProperties();
        if (data.length === 0) {
          setProperties(INITIAL_PROPERTIES);
        } else {
          setProperties(data);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
        setProperties(INITIAL_PROPERTIES);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      const matchesSearch = 
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = selectedType === 'all' || property.type === selectedType;
      
      return matchesSearch && matchesType;
    });
  }, [properties, searchQuery, selectedType]);

  const groupedProperties = useMemo(() => {
    const groups: Record<string, Property[]> = {};
    filteredProperties.forEach(p => {
      const type = p.type || 'other';
      if (!groups[type]) groups[type] = [];
      groups[type].push(p);
    });
    return groups;
  }, [filteredProperties]);

  if (loading) {
    return (
      <div className="py-32 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-gold animate-spin" />
      </div>
    );
  }

  return (
    <section id={id} className="py-32 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8 text-neutral-100">
        <div className="max-w-2xl">
          <span className="text-gold uppercase tracking-[0.3em] text-[10px] mb-4 block font-medium">{t('curated_listings')}</span>
          <h2 className="text-5xl md:text-7xl font-serif leading-tight">{t('properties')}</h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative group min-w-[280px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-gold transition-colors" />
            <input 
              type="text" 
              placeholder={t('search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-3.5 pl-12 pr-6 text-sm focus:outline-none focus:border-gold/50 transition-all placeholder:text-white/20"
            />
          </div>
          <div className="relative group">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-gold transition-colors" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="appearance-none w-full bg-white/5 border border-white/10 rounded-full py-3.5 pl-12 pr-12 text-sm focus:outline-none focus:border-gold/50 transition-all cursor-pointer capitalize"
            >
              {PROPERTY_TYPES.map(type => (
                <option key={type} value={type} className="bg-dark text-white uppercase tracking-widest text-[10px]">
                  {t(type)}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="space-y-32">
        {Object.entries(groupedProperties).length > 0 ? (
          Object.entries(groupedProperties).map(([type, typeProperties], groupIndex) => (
            <div key={type} className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="flex items-center gap-6 mb-12">
                <h3 className="text-xs uppercase tracking-[0.5em] font-bold text-gold whitespace-nowrap">{t(type)}</h3>
                <div className="h-px bg-white/10 w-full" />
                <span className="text-[10px] text-white/30 font-mono italic">({typeProperties.length})</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
                {typeProperties.map((property, index) => (
                  <motion.div
                    key={property.id || `${type}-${index}`}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.8 }}
                    className="group cursor-pointer"
                    onClick={() => setSelectedProperty(property)}
                    onMouseEnter={() => setHoveredProperty(property.id || `${type}-${index}`)}
                    onMouseLeave={() => setHoveredProperty(null)}
                  >
                    {/* ... (rest of property card UI) ... */}
                    <div className="relative overflow-hidden rounded-2xl mb-8 aspect-[4/5] shadow-2xl">
                      <motion.img 
                        src={property.image} 
                        alt={property.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent opacity-80 z-20" />
                      
                      <div className="absolute top-6 left-6 z-30 flex flex-col gap-2">
                        <span className="bg-gold text-dark text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full font-bold shadow-lg">
                          {t('featured')}
                        </span>
                        {property.videoUrl && (
                          <span className="bg-dark/60 backdrop-blur-md text-white text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full font-bold shadow-lg flex items-center gap-1.5">
                            <Video className="w-3 h-3 text-gold" />
                            Video
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-8 left-8 right-8 z-30 flex justify-between items-end">
                        <div className="text-neutral-100">
                          <div className="text-gold font-serif text-3xl mb-1">{property.price}</div>
                          <div className="text-white/60 text-[10px] uppercase tracking-widest flex items-center gap-2">
                            <MapPin className="w-3 h-3" />
                            {property.location}
                          </div>
                        </div>
                        {property.videoUrl && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProperty(property);
                            }}
                            className="bg-gold text-dark p-3 rounded-full shadow-2xl group/btn transition-all duration-300 hover:bg-white flex items-center gap-2"
                          >
                            <Play className="w-4 h-4 fill-current" />
                            <span className="text-[10px] uppercase tracking-widest font-bold pr-2 hidden group-hover/btn:block transition-all">Watch Video</span>
                          </motion.button>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-6 px-2 text-neutral-100">
                      <h3 className="text-3xl font-serif group-hover:text-gold transition-colors duration-500 leading-tight">
                        {property.title}
                      </h3>
                      
                      <div className="flex items-center justify-between border-t border-white/5 pt-6">
                        <div className="flex items-center gap-6 text-white/40 text-xs">
                          <div className="flex items-center gap-2.5">
                            <Bed className="w-4 h-4 text-gold/50" />
                            <span className="tracking-widest">{property.beds} <span className="text-[10px] opacity-50">{t('bedrooms')}</span></span>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <Bed className="w-4 h-4 text-gold/50" />
                            <span className="tracking-widest">{property.baths} <span className="text-[10px] opacity-50">{t('bathrooms')}</span></span>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <Square className="w-4 h-4 text-gold/50" />
                            <span className="tracking-widest">{property.sqft} <span className="text-[10px] opacity-50">{t('area')}</span></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center">
            <p className="text-white/40 text-lg font-light italic">{t('no_properties')}</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedType('all'); }}
              className="mt-6 text-gold underline underline-offset-8 text-xs uppercase tracking-widest font-bold hover:text-white transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Property Detail Modal */}
      <AnimatePresence>
        {selectedProperty && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProperty(null)}
              className="absolute inset-0 bg-dark/95 backdrop-blur-xl"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl max-h-[90vh] glass rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl text-neutral-100"
            >
              <button 
                onClick={() => setSelectedProperty(null)}
                className="absolute top-6 right-6 z-10 bg-dark/50 hover:bg-gold p-2 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Left: Image Gallery */}
              <div className="w-full md:w-1/2 h-64 md:h-auto overflow-y-auto scrollbar-hide space-y-2 p-2 bg-dark/50">
                <img 
                  src={selectedProperty.image} 
                  alt={selectedProperty.title}
                  className="w-full aspect-[4/3] object-cover rounded-2xl"
                  referrerPolicy="no-referrer"
                />
                {selectedProperty.gallery?.map((img, i) => (
                  <img 
                    key={i}
                    src={img} 
                    alt={`${selectedProperty.title} gallery ${i}`}
                    className="w-full aspect-[4/3] object-cover rounded-2xl"
                    referrerPolicy="no-referrer"
                  />
                ))}
              </div>

              {/* Right: Details */}
              <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto">
                <div className="mb-8">
                  <div className="flex items-center gap-2 text-gold text-xs uppercase tracking-widest mb-4">
                    <MapPin className="w-3 h-3" />
                    {selectedProperty.location}
                  </div>
                  <h2 className="text-4xl md:text-5xl font-serif mb-4 uppercase">{selectedProperty.title}</h2>
                  <div className="text-2xl text-gold font-serif">{selectedProperty.price}</div>
                </div>

                <div className="flex items-center gap-8 text-white/60 text-sm mb-10 pb-10 border-b border-white/10">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-widest text-white/30">{t('bedrooms')}</span>
                    <div className="flex items-center gap-2 text-white">
                      <Bed className="w-4 h-4" />
                      <span className="text-lg">{selectedProperty.beds}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-widest text-white/30">{t('bathrooms')}</span>
                    <div className="flex items-center gap-2 text-white">
                      <Bed className="w-4 h-4" />
                      <span className="text-lg">{selectedProperty.baths}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-widest text-white/30">{t('area')}</span>
                    <div className="flex items-center gap-2 text-white">
                      <Square className="w-4 h-4" />
                      <span className="text-lg">{selectedProperty.sqft} <span className="text-sm text-white/40">sqft</span></span>
                    </div>
                  </div>
                </div>

                <div className="mb-10">
                  <h3 className="text-lg font-serif mb-4 text-gold">{t('description')}</h3>
                  <p className="text-white/70 leading-relaxed font-light">
                    {selectedProperty.description}
                  </p>
                </div>

                <div className="mb-10">
                  <h3 className="text-lg font-serif mb-4 text-gold">{t('amenities')}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedProperty.amenities?.map((amenity, i) => (
                      <div key={i} className="flex items-center gap-2 text-white/60 text-sm">
                        <Check className="w-4 h-4 text-gold" />
                        {amenity}
                      </div>
                    ))}
                  </div>
                </div>

                {selectedProperty.videoUrl && (
                  <div className="mb-10">
                    <h3 className="text-lg font-serif mb-4 text-gold">Property Video</h3>
                    <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black">
                      {selectedProperty.videoUrl.includes('youtube.com') || selectedProperty.videoUrl.includes('youtu.be') ? (
                        <iframe 
                          src={selectedProperty.videoUrl.includes('youtu.be') 
                            ? `https://www.youtube.com/embed/${selectedProperty.videoUrl.split('/').pop()}`
                            : selectedProperty.videoUrl.replace('watch?v=', 'embed/')} 
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen
                        />
                      ) : (
                        <video 
                          src={selectedProperty.videoUrl} 
                          controls 
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </div>
                )}

                <button className="w-full bg-gold text-dark py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors">
                  {t('inquiry')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
