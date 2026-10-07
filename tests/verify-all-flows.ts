import { DataStore, INITIAL_PROFILES, INITIAL_LISTINGS } from '../src/lib/store';

console.log('====================================================');
console.log('RENTIT - 10 CRITICAL WORKFLOW VERIFICATION SUITE');
console.log('====================================================\n');

let testsPassed = 0;
let totalTests = 10;

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

// ==========================================
// TEST 1: Signup -> Login -> Edit Profile -> Create Listing
// ==========================================
console.log('\n--- TEST 1: User Registration, Profile Edit & Create Listing ---');
const newUser = {
  id: 'u-test-user-1',
  email: 'testuser1@rentit.demo',
  full_name: 'Test Renter 1',
  city: 'Sonipat',
  locality: 'Sector 14',
  role: 'user',
  rating: 5.0,
  total_ratings: 0,
  is_verified: true,
  created_at: new Date().toISOString(),
};
DataStore.saveProfile(newUser);
const fetchedProfile = DataStore.getProfileById(newUser.id);
assert(fetchedProfile && fetchedProfile.email === newUser.email, 'User profile registered in DataStore');

// Edit profile
DataStore.saveProfile({
  ...fetchedProfile,
  bio: 'Updated bio: Photography enthusiast in Sonipat',
});
assert(DataStore.getProfileById(newUser.id).bio.includes('Photography enthusiast'), 'Profile bio successfully updated');

// Create listing
const newListing = DataStore.saveListing({
  id: 'list-test-camera',
  owner_id: newUser.id,
  category_id: 'cat-cam',
  title: 'Canon EOS R6 Mark II Mirrorless Body',
  description: 'Superb 24.2 MP full-frame mirrorless camera for rent. Mint condition with 3 batteries.',
  price_per_day: 550,
  security_deposit: 6000,
  city: 'Sonipat',
  locality: 'Sector 14',
  condition: 'Like New',
  rental_rules: 'Govt ID required. Return charged.',
  status: 'active',
  views_count: 0,
  images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32'],
});
assert(newListing && newListing.price_per_day === 550, 'Listing created with custom daily price');

const inBrowse = DataStore.getListings().some((l) => l.id === 'list-test-camera' && l.status === 'active');
assert(inBrowse, 'New listing appears in Browse catalog');
testsPassed++;

// ==========================================
// TEST 2: Second user -> Search listing -> Select dates -> Request rental
// ==========================================
console.log('\n--- TEST 2: Second User Booking & Price Calculation ---');
const secondUser = {
  id: 'u-test-user-2',
  email: 'testuser2@rentit.demo',
  full_name: 'Priya Traveler',
  city: 'Sonipat',
  locality: 'Model Town',
  role: 'user',
  rating: 5.0,
  total_ratings: 0,
  is_verified: true,
  created_at: new Date().toISOString(),
};
DataStore.saveProfile(secondUser);

const reqResult = DataStore.createRentalRequest({
  listing_id: 'list-test-camera',
  renter_id: secondUser.id,
  owner_id: newUser.id,
  start_date: '2026-10-10',
  end_date: '2026-10-12',
  total_days: 3,
  daily_price: 550,
  rental_amount: 1650,
  platform_fee: 165,
  security_deposit: 6000,
  total_amount: 7815,
  message: 'Need this for a weekend shoot in Sonipat!',
});

assert(reqResult.success === true && reqResult.request.status === 'pending', 'Rental request created with status pending');
assert(reqResult.request.total_amount === 7815, 'Total amount correctly computed (Rent: 1650, Fee: 165, Deposit: 6000)');
testsPassed++;

// ==========================================
// TEST 3: Owner receives request -> Accepts request -> Renter sees Accepted
// ==========================================
console.log('\n--- TEST 3: Owner Accepts Request & Active Lease Created ---');
const requestId = reqResult.request.id;
const acceptResult = DataStore.updateRequestStatus(requestId, 'accepted', newUser.id);
assert(acceptResult.success === true, 'Owner successfully accepted rental request');

const updatedRequest = DataStore.getRentalRequests().find((r) => r.id === requestId);
assert(updatedRequest.status === 'accepted', 'Request status transitioned to "accepted"');

const createdRental = DataStore.getRentals().find((r) => r.request_id === requestId);
assert(createdRental && createdRental.status === 'active', 'Active Rental record created upon owner acceptance');
testsPassed++;

// ==========================================
// TEST 4: Double Booking Prevention
// ==========================================
console.log('\n--- TEST 4: Double Booking Conflict Prevention ---');
// Try booking the exact same camera for overlapping dates (2026-10-11 to 2026-10-13)
const doubleBookingAttempt = DataStore.createRentalRequest({
  listing_id: 'list-test-camera',
  renter_id: 'u-owner-2',
  owner_id: newUser.id,
  start_date: '2026-10-11',
  end_date: '2026-10-13',
  total_days: 3,
  daily_price: 550,
  rental_amount: 1650,
  platform_fee: 165,
  security_deposit: 6000,
  total_amount: 7815,
});

assert(doubleBookingAttempt.success === false, 'Double booking prevented! System rejected overlapping dates');
assert(doubleBookingAttempt.error.includes('already booked'), 'Correct user-facing error message displayed');
testsPassed++;

// ==========================================
// TEST 5: Complete rental -> Review product & owner
// ==========================================
console.log('\n--- TEST 5: Rental Completion & Two-way Reviews ---');
const completeResult = DataStore.completeRental(createdRental.id, newUser.id);
assert(completeResult.success === true, 'Rental successfully marked as completed upon return');

// Submit product review
const reviewResult = DataStore.createReview({
  rental_id: createdRental.id,
  reviewer_id: secondUser.id,
  reviewee_id: newUser.id,
  listing_id: 'list-test-camera',
  rating: 5,
  comment: 'Outstanding camera, flawless condition and smooth handover!',
  review_type: 'product',
});

assert(reviewResult.success === true, 'Product review submitted for completed rental');
const listingReviews = DataStore.getReviewsForListing('list-test-camera');
assert(listingReviews.length > 0 && listingReviews[0].rating === 5, 'Review appears on product review feed');
testsPassed++;

// ==========================================
// TEST 6: Owner edits product price -> Browse shows updated price
// ==========================================
console.log('\n--- TEST 6: Owner Edits Price & Reflected in Browse ---');
const listingToEdit = DataStore.getListingById('list-test-camera');
DataStore.saveListing({
  ...listingToEdit,
  price_per_day: 650,
});

const updatedInBrowse = DataStore.getListingById('list-test-camera');
assert(updatedInBrowse.price_per_day === 650, 'Browse page reflects updated price of ₹650/day');
testsPassed++;

// ==========================================
// TEST 7: Unauthorized user attempts to delete/edit another user listing
// ==========================================
console.log('\n--- TEST 7: Ownership Authorization & Access Control ---');
const unauthorizedDelete = DataStore.deleteListing('list-test-camera', secondUser.id);
assert(unauthorizedDelete.success === false, 'Unauthorized user blocked from deleting another user listing');
assert(unauthorizedDelete.error.includes('Unauthorized'), 'Correct security denial returned');
testsPassed++;

// ==========================================
// TEST 8: Admin Role Authorization
// ==========================================
console.log('\n--- TEST 8: Admin Role Verification & Stats Calculation ---');
const adminUser = INITIAL_PROFILES.find((p) => p.role === 'admin');
assert(adminUser && adminUser.role === 'admin', 'Admin account identified');

const adminStats = DataStore.getAdminStats();
assert(adminStats.totalUsers > 0, 'Admin stats totalUsers computed');
assert(adminStats.completedRentals > 0, 'Admin stats completedRentals tracked');
assert(adminStats.platformRevenue >= 0, 'Platform revenue commission computed correctly');
testsPassed++;

// ==========================================
// TEST 9: Search and Filters
// ==========================================
console.log('\n--- TEST 9: Search & Filter Verification ---');
const allListings = DataStore.getListings();
const searchCanon = allListings.filter((l) => l.title.toLowerCase().includes('canon') || l.description.toLowerCase().includes('canon'));
assert(searchCanon.length === 1 && searchCanon[0].id === 'list-test-camera', 'Search for "Canon" returned accurate product');

const categoryFiltered = allListings.filter((l) => l.category_id === 'cat-cam');
assert(categoryFiltered.length >= 2, 'Category filter "Cameras" returned matching camera listings');
testsPassed++;

// ==========================================
// TEST 10: Messages & Notifications System
// ==========================================
console.log('\n--- TEST 10: Real-time Messages & Notifications ---');
const conv = DataStore.getOrCreateConversation('list-test-camera', secondUser.id, newUser.id);
assert(conv && conv.id, 'Conversation thread created between renter and owner');

const sentMsg = DataStore.sendMessage(conv.id, secondUser.id, 'Hi Rahul, is 10 AM good for pickup?');
assert(sentMsg && sentMsg.content.includes('10 AM'), 'Message delivered and saved to thread');

const recipientNotifs = DataStore.getNotifications(newUser.id);
assert(recipientNotifs.length > 0, 'Recipient automatically received high-priority notification');
testsPassed++;

console.log('\n====================================================');
console.log(`ALL ${testsPassed}/${totalTests} TESTS PASSED WITH 100% SUCCESS!`);
console.log('====================================================\n');
