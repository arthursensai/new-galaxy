import { useState, useEffect } from 'react'
import { getShopData } from './firebase.js';

const ShopDataDisplay = ({ data }) => {
    const handleWhatsAppRedirect = (item) => {
        const phoneNumber = '+963992984704';
        // Construct Arabic message
        const message = `مرحبًا، أود طلب المنتج: ${item.name}\n\nتفاصيل المنتج:\n${item.description}\n\nالسعر: ${item.price} نجمة`;
        
        const encodedMessage = encodeURIComponent(message);
        
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.map(item => (
                <div 
                    key={item.id} 
                    className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105"
                >
                    {}
                    <div 
                        className="relative w-full" 
                        style={{ 
                            paddingTop: `${(item.height / item.width) * 100 || 75}%` 
                        }}
                    >
                        <img 
                            src={item.cover || '/placeholder-image.png'} 
                            alt={item.name} 
                            className="absolute top-0 left-0 w-full h-full object-cover"
                        />
                    </div>
                    
                    {}
                    <div className="p-4">
                        <h3 className="font-bold text-xl mb-2">{item.name}</h3>
                        <p className="text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                        
                        {}
                        <div className="flex justify-between items-center">
                            <div className="flex items-center text-yellow-500">
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    viewBox="0 0 24 24" 
                                    fill="currentColor" 
                                    className="w-6 h-6 mr-1"
                                >
                                    <path 
                                        fillRule="evenodd" 
                                        d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.93.97l1.222.516a.75.75 0 010 1.372l-1.222.516a1.5 1.5 0 00-.93.97l-.394 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.929-.97l-1.222-.516a.75.75 0 010-1.372l1.222-.516c.43-.171.78-.523.929-.97l.395-1.183A.75.75 0 0116.5 15z" 
                                        clipRule="evenodd" 
                                    />
                                </svg>
                                <span className="font-semibold">{item.price}</span>
                            </div>
                            <button 
                                onClick={() => handleWhatsAppRedirect(item)}
                                className="bg-green-600 text-white px-3 py-1 rounded-full hover:bg-green-700 transition-colors flex items-center"
                            >
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    width="24" 
                                    height="24" 
                                    viewBox="0 0 24 24" 
                                    fill="currentColor" 
                                    className="w-5 h-5 mr-1"
                                >
                                    <path 
                                        d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.149-.173.198-.297.297-.495.099-.198.05-.372-.025-.521-.074-.149-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" 
                                    />
                                </svg>
                                طلب
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

const Shop = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchShopData = async () => {
        setLoading(true);
        setError(null);
        try {
            const shopPath = '/shop';
            const shopData = await getShopData(shopPath);
            
            // Convert Realtime Database object to array
            if (shopData) {
                const dataArray = Object.keys(shopData).map(key => ({
                    id: key,
                    ...shopData[key],
                    // Fallback to 16:9 aspect ratio if no dimensions provided
                    width: shopData[key].width || 16,
                    height: shopData[key].height || 9
                }));
                setData(dataArray);
            } else {
                setData([]);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to load shop data');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchShopData();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="text-red-500 text-center text-xl mt-10">
            {error}
        </div>
    );

    return (
        <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Our Shop</h1>
            {data.length > 0 ? (
                <ShopDataDisplay data={data} />
            ) : (
                <p className="text-center text-gray-600 text-xl">No items available</p>
            )}
        </div>
    );
}

export default Shop;