import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

// Enhanced order card component
function OrderCard({ order }) {
    const getStatusColor = (status) => {
        switch ((status || '').toLowerCase()) {
            case 'completed':
            case 'report submitted':
                return 'bg-green-100 text-green-800';
            case 'approved':
            case 'sample collected':
                return 'bg-blue-100 text-blue-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'denied':
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'processing':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="p-4 border rounded-lg mb-3 bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800 mb-1">
                        {order.name}
                    </div>
                    <div className="text-xs text-gray-600 mb-1">
                        <span className="font-medium">Lab:</span> {order.lab}
                    </div>
                    <div className="text-xs text-gray-600">
                        <span className="font-medium">Date:</span> {new Date(order.date).toLocaleDateString()}
                    </div>
                </div>
                <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                    </span>
                    <div className="text-sm font-semibold text-gray-800 mt-1">
                        ₹{order.totalPrice}
                    </div>
                </div>
            </div>
        </div>
    );
}

const FamilyHealth = () => {
    const { user, token } = useAuth();
    const [members, setMembers] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [memberOrders, setMemberOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState(null);

    // Debug logging
    useEffect(() => {
        console.log('FamilyHealth - Current user:', user);
        console.log('FamilyHealth - Token exists:', !!token);
    }, [user, token]);

    useEffect(() => {
        const fetchFamilyMembers = async () => {
            if (!user || !token) {
                console.log('No user or token available');
                setLoading(false);
                return;
            }

            setLoading(true);
            setApiError(null);

            try {
                console.log('Fetching family members...');

                const res = await fetch(`http://localhost:5000/api/v1/orders/family-members`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                console.log('Response status:', res.status);
                console.log('Response ok:', res.ok);

                const data = await res.json();
                console.log('Full API response:', data);

                if (!res.ok) {
                    throw new Error(data.message || `HTTP ${res.status}: Failed to load members`);
                }

                const fetchedMembers = data.members || [];
                console.log('Fetched members:', fetchedMembers);
                setMembers(fetchedMembers);

                // Generate recommendations
                const newRecommendations = fetchedMembers.slice(0, 3).map((member) => ({
                    id: `rec_${member.id}`,
                    title: `Health Checkup for ${member.name}`,
                    description: `Recommended checkup for ${member.name} (${member.relation})`,
                    memberId: member.id,
                    memberName: member.name,
                    relation: member.relation
                }));

                setRecommendations(newRecommendations);

            } catch (err) {
                console.error('Error fetching family members:', err);
                setApiError(err.message || String(err));
                setMembers([]);
                setRecommendations([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFamilyMembers();
    }, [user, token]);

    const handleViewHistory = (member) => {
        console.log('Viewing history for member:', member);
        setSelectedMember(member);
        setMemberOrders(member.tests || []); // Use the tests array directly
    };

    const handleCloseModal = () => {
        setSelectedMember(null);
        setMemberOrders([]);
        setApiError(null);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E23744]" />
                <span className="ml-3 text-gray-600">Loading family members...</span>
            </div>
        );
    }

    return (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-8">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6">
                Family Health Report Book
            </h2>

           

            {apiError && (
                <div className="max-w-lg mx-auto mb-6 text-center">
                    <div className="inline-block px-4 py-2 bg-red-50 border border-red-300 text-red-600 rounded">
                        ⚠️ {apiError}
                    </div>
                </div>
            )}

            {/* Family Members Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
                {members.map((member) => (
                    <div key={member.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                        <div className="flex items-center gap-4 mb-4">
                            <img
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=E23744&color=fff&size=48`}
                                className="w-12 h-12 rounded-full"
                                alt={member.name}
                            />
                            <div className="flex-1">
                                <h4 className="text-lg font-semibold text-gray-800">{member.name}</h4>
                                <p className="text-sm text-gray-500">
                                    {member.relation}
                                    {member.age !== 'N/A' && ` • ${member.age}y`}
                                    {member.gender !== 'N/A' && ` • ${member.gender}`}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {member.orderCount} order{member.orderCount !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2 mb-4">
                            <div className="text-sm text-gray-600">
                                <span className="font-medium">Recent Tests:</span>
                            </div>
                            {(member.tests || []).slice(0, 2).map((test, i) => (
                                <div key={i} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                                    <span className="truncate mr-2">{test.name}</span>
                                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(test.status)}`}>
                                        {test.status}
                                    </span>
                                </div>
                            ))}

                            {(member.tests || []).length === 0 && (
                                <p className="text-sm text-gray-400 italic bg-gray-50 p-2 rounded">
                                    No tests recorded yet
                                </p>
                            )}

                            {(member.tests || []).length > 2 && (
                                <p className="text-xs text-gray-500 text-center">
                                    +{member.tests.length - 2} more test{member.tests.length - 2 !== 1 ? 's' : ''}
                                </p>
                            )}
                        </div>

                        <button
                            onClick={() => handleViewHistory(member)}
                            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition-colors duration-200"
                        >
                            View Full History ({member.tests?.length || 0})
                        </button>
                    </div>
                ))}

                {members.length === 0 && !loading && (
                    <div className="col-span-full text-center text-gray-500 py-12">
                        <div className="text-gray-400 text-6xl mb-4">👥</div>
                        <h3 className="text-lg font-medium mb-2">No Family Members Found</h3>
                        <p className="text-sm mb-4">
                            Family members will appear here once they have placed orders with relation other than 'self'.
                        </p>
                        <div className="text-xs text-gray-400 bg-gray-50 p-3 rounded">
                            <strong>Debug:</strong> Looking for orders where patientInfo.relation ≠ 'self' and patientInfo.userId matches your account.
                        </div>
                    </div>
                )}
            </div>

            {/* Smart Recommendations */}
            {recommendations.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Smart Recommendations</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recommendations.map((rec) => (
                            <div key={rec.id} className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-500">
                                <h4 className="font-medium text-gray-800 mb-2">{rec.title}</h4>
                                <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                                <button className="w-full bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 transition-colors duration-200">
                                    Schedule Test
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Order History Modal */}
            {selectedMember && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b px-6 py-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800">
                                        {selectedMember.name}'s Health History
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {selectedMember.relation}
                                        {selectedMember.age !== 'N/A' && ` • Age ${selectedMember.age}`}
                                        {selectedMember.gender !== 'N/A' && ` • ${selectedMember.gender}`}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {selectedMember.orderCount} total order{selectedMember.orderCount !== 1 ? 's' : ''}
                                    </p>
                                </div>
                                <button
                                    onClick={handleCloseModal}
                                    className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center"
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            {memberOrders.length > 0 ? (
                                <div className="space-y-3">
                                    <div className="text-sm text-gray-600 mb-4">
                                        Showing {memberOrders.length} test{memberOrders.length !== 1 ? 's' : ''} for {selectedMember.name}
                                    </div>
                                    {memberOrders.map((order, index) => (
                                        <OrderCard key={order.orderId || index} order={order} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-gray-500 py-8">
                                    <div className="text-gray-400 text-4xl mb-4">📋</div>
                                    <h4 className="text-lg font-medium mb-2">No Test History</h4>
                                    <p className="text-sm">
                                        No test orders found for {selectedMember.name}.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

// Helper function for status colors (moved outside component to avoid re-creation)
function getStatusColor(status) {
    switch ((status || '').toLowerCase()) {
        case 'completed':
        case 'report submitted':
            return 'bg-green-100 text-green-800';
        case 'approved':
        case 'sample collected':
            return 'bg-blue-100 text-blue-800';
        case 'pending':
            return 'bg-yellow-100 text-yellow-800';
        case 'denied':
        case 'cancelled':
            return 'bg-red-100 text-red-800';
        case 'processing':
            return 'bg-purple-100 text-purple-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

export default FamilyHealth;
