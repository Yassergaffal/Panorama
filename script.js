let bookings = JSON.parse(localStorage.getItem('bookings')) || [] 
let companies = JSON.parse(localStorage.getItem('companies')) || []
let hotels = JSON.parse(localStorage.getItem('hotels')) || []
let editingCompanyIndex = null // مؤشر الشركة التي يتم تعديلها
let editingHotelIndex = null // مؤشر الفندق الذي يتم تعديله
let editingIndex = null // مؤشر الحجز الذي يتم تعديله

let isAuth = JSON.parse(localStorage.getItem('auth'))

// تسجيل الدخول
document.getElementById('login-form').addEventListener('submit', function (e) {
  e.preventDefault()

  const username = document.getElementById('username').value
  const password = document.getElementById('password').value

  const users = [
    { username: 'admin', password: '123' },
    { username: 'user1', password: 'mypassword' },
  ]

  const user = users.find(
    (u) => u.username === username && u.password === password
  )

  if (user) {
    alert('تم تسجيل الدخول بنجاح!')
    localStorage.setItem('auth', true)

    document.getElementById('login-container').classList.add('hidden')
    document.getElementById('welcome-container').classList.remove('hidden')
  } else {
    alert('اسم المستخدم أو كلمة المرور غير صحيحة.')
  }
})

// إضافة شركة جديدة
document
  .getElementById('add-company-btn')
  .addEventListener('click', function () {
    toggleVisibility('welcome-container', 'add-company-container')
    document.getElementById('company-name-input').value = '' // إعادة تعيين حقل الاسم
    editingCompanyIndex = null // إعادة تعيين مؤشر التعديل
  })

document
  .getElementById('company-form')
  .addEventListener('submit', function (e) {
    e.preventDefault()
    const companyName = document.getElementById('company-name-input').value

    if (companyName && !companies.includes(companyName)) {
      companies.push(companyName)

      localStorage.setItem('companies', JSON.stringify(companies))
      updateCompanySelect()
      alert('تم إضافة الشركة بنجاح!')
    } else if (editingCompanyIndex !== null) {
      companies[editingCompanyIndex] = companyName
      localStorage.setItem('companies', JSON.stringify(companies))
      alert('تم تعديل الشركة بنجاح!')
      editingCompanyIndex = null
      updateCompanySelect()
    } else {
      alert('الشركة موجودة بالفعل أو الحقل فارغ.')
    }

    document.getElementById('company-name-input').value = ''
    toggleVisibility('add-company-container', 'welcome-container')
  })

// تعديل شركة
function editCompany(index) {
  document.getElementById('company-name-input').value = companies[index]
  editingCompanyIndex = index
  toggleVisibility('welcome-container', 'add-company-container')
}

// إضافة فندق جديد
document.getElementById('add-hotel-btn').addEventListener('click', function () {
  toggleVisibility('welcome-container', 'add-hotel-container')
  document.getElementById('hotel-name-input').value = '' // إعادة تعيين حقل الاسم
  editingHotelIndex = null // إعادة تعيين مؤشر التعديل
})

document.getElementById('hotel-form').addEventListener('submit', function (e) {
  e.preventDefault()
  const hotelName = document.getElementById('hotel-name-input').value
  const formData = new FormData(e.currentTarget)

  const pickUp = {
    '09:00': formData.get('pick-up-09:00'),
    '10:30': formData.get('pick-up-10:30'),
    '12:00': formData.get('pick-up-12:00'),
    '13:00': formData.get('pick-up-13:00'),
    '15:00': formData.get('pick-up-15:00'),
    '16:30': formData.get('pick-up-16:30'),
  }

  if (hotelName && !hotels.includes(hotelName)) {
    hotels.push({ hotelName, pickUp })
    localStorage.setItem('hotels', JSON.stringify(hotels))
    updateHotelSelect()
    alert('تم إضافة الفندق بنجاح!')
  } else if (editingHotelIndex !== null) {
    hotels[editingHotelIndex] = hotelName
    localStorage.setItem('hotels', hotels)
    alert('تم تعديل الفندق بنجاح!')
    editingHotelIndex = null
    updateHotelSelect()
  } else {
    alert('الفندق موجود بالفعل أو الحقل فارغ.')
  }

  document.getElementById('hotel-name-input').value = ''
  toggleVisibility('add-hotel-container', 'welcome-container')
})

// تعديل فندق
function editHotel(index) {
  document.getElementById('hotel-name-input').value = hotels[index]
  editingHotelIndex = index
  toggleVisibility('welcome-container', 'add-hotel-container')
}

// العودة إلى الصفحة الرئيسية من إضافة شركة أو فندق
document
  .getElementById('back-to-welcome-from-company')
  .addEventListener('click', () =>
    toggleVisibility('add-company-container', 'welcome-container')
  )
document
  .getElementById('back-to-welcome-from-hotel')
  .addEventListener('click', () =>
    toggleVisibility('add-hotel-container', 'welcome-container')
  )

// إضافة حجز جديد
document
  .getElementById('add-booking-btn')
  .addEventListener('click', function () {
    toggleVisibility('welcome-container', 'booking-container')
    resetBookingForm()
  })

// عند حفظ الحجز
document
  .getElementById('booking-form')
  .addEventListener('submit', function (e) {
    e.preventDefault()

    const booking = {
      travelDate: document.getElementById('travel-date').value,
      tripType: document.getElementById('trip-type').value,
      tripTime: document.getElementById('trip-time').value,
      companyName: document.getElementById('company-name').value,
      hotelName: document.getElementById('hotel-name').value,
      roomNumber: document.getElementById('room-number').value,
      adults: document.getElementById('adults').value,
      children: document.getElementById('children').value,
      infants: document.getElementById('infants').value,
      notes: document.getElementById('notes').value,
      pickUp: null
    }

    function getPickUp() {
      const hotel = hotels.find((hotel) => hotel.hotelName === this.hotelName)
      if (!hotel) {
        console.log(this.hotelName)
        
        console.error('Hotel not found')
        return null
      }
      const pickUp = hotel.pickUp[this.tripTime.trim()]
      
      return pickUp
    }
    booking.pickUp = getPickUp.bind(booking)()
    if (editingIndex === null) {
      bookings.push(booking)
      localStorage.setItem('bookings', JSON.stringify(bookings))
    } else {
      bookings[editingIndex] = booking
      localStorage.setItem('bookings', JSON.stringify(bookings))
      editingIndex = null
    }

    alert('تم الحجز بنجاح!')
    toggleVisibility('booking-container', 'welcome-container')
    updateReportTable()
  })

// عرض التقرير
document
  .getElementById('view-report-btn')
  .addEventListener('click', function () {
    toggleVisibility('welcome-container', 'report-container')
    updateReportTable()
  })

// تطبيق الفلاتر في التقرير
document
  .getElementById('apply-filters-btn')
  .addEventListener('click', function () {
    updateReportTable()
  })

// تحميل التقرير
document
  .getElementById('download-report-btn')
  .addEventListener('click', function () {
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(
      bookings.map((booking) => ({
        travelDate: booking.travelDate,
        tripType: booking.tripType,
        tripTime: booking.tripTime,
        companyName: booking.companyName,
        hotelName: booking.hotelName,
        roomNumber: booking.roomNumber,
        adults: booking.adults,
        children: booking.children,
        infants: booking.infants,
        notes: booking.notes,
      }))
    )
    XLSX.utils.book_append_sheet(wb, ws, 'تقرير الحجوزات')
    XLSX.writeFile(wb, 'تقرير الحجوزات.xlsx')
  })

// طباعة التقرير
document
  .getElementById('print-report-btn')
  .addEventListener('click', function () {
    window.print()
  })

// العودة إلى الصفحة الرئيسية من التقرير
document
  .getElementById('back-to-welcome-report-btn')
  .addEventListener('click', function () {
    toggleVisibility('report-container', 'welcome-container')
  })

// العودة إلى الصفحة الرئيسية من حجز
document
  .getElementById('back-to-welcome-btn')
  .addEventListener('click', function () {
    toggleVisibility('booking-container', 'welcome-container')
  })

// تعديل الحجز
function editBooking(index) {
  const booking = bookings[index]
  document.getElementById('travel-date').value = booking.travelDate
  document.getElementById('trip-type').value = booking.tripType
  document.getElementById('trip-time').value = booking.tripTime
  document.getElementById('company-name').value = booking.companyName
  document.getElementById('hotel-name').value = booking.hotelName
  document.getElementById('room-number').value = booking.roomNumber
  document.getElementById('adults').value = booking.adults
  document.getElementById('children').value = booking.children
  document.getElementById('infants').value = booking.infants
  document.getElementById('notes').value = booking.notes

  editingIndex = index
  toggleVisibility('report-container', 'booking-container')
}

// حذف الحجز
function deleteBooking(index) {
  bookings.splice(index, 1)
  localStorage.setItem('bookings', JSON.stringify(bookings))
  updateReportTable()
}

// تحديث جدول التقرير
function updateReportTable() {
  const reportBody = document.getElementById('report-body')
  reportBody.innerHTML = ''

  const filters = {
    date: document.getElementById('filter-date').value,
    tripType: document.getElementById('filter-trip-type').value,
    tripTime: document.getElementById('filter-trip-time').value,
  }

  let totalAdults = 0
  let totalChildren = 0
  let totalInfants = 0

  bookings
    .filter((booking) => {
      return (
        (!filters.date || booking.travelDate === filters.date) &&
        (!filters.tripType || booking.tripType === filters.tripType) &&
        (!filters.tripTime || booking.tripTime === filters.tripTime)
      )
    })
    .forEach((booking, index) => {
      const row = document.createElement('tr')
      const bookingData = [
        booking.companyName,
        booking.hotelName,
        booking.pickUp,
        booking.roomNumber,
        booking.adults,
        booking.children,
        booking.infants,
        booking.notes,
      ]

      bookingData.forEach((value) => {
        const cell = document.createElement('td')
        cell.textContent = value
        row.appendChild(cell)
      })

      const actionCell = document.createElement('td')
      actionCell.innerHTML = `<button onclick="editBooking(${index})">تعديل</button> <button onclick="deleteBooking(${index})">حذف</button>`
      row.appendChild(actionCell)

      reportBody.appendChild(row)

      // جمع إجماليات البالغين، الأطفال، والرضع
      totalAdults += parseInt(booking.adults) || 0
      totalChildren += parseInt(booking.children) || 0
      totalInfants += parseInt(booking.infants) || 0
    })

  // إضافة صف الإجماليات
  const totalRow = document.createElement('tr')
  totalRow.innerHTML = `
    <td colspan="4" style="text-align: right;">Total</td>
    <td>${totalAdults}</td>
    <td>${totalChildren}</td>
    <td>${totalInfants}</td>
    <td></td>
  `
  reportBody.appendChild(totalRow)
}

// تحديث قائمة الشركات
function updateCompanySelect() {
  const companyList = document.getElementById('company-list')
  companyList.innerHTML = '' // مسح العناصر السابقة

  companies.forEach((company) => {
    const option = document.createElement('option')
    option.value = company
    companyList.appendChild(option)
  })
}

// تحديث قائمة الفنادق
function updateHotelSelect() {
  const hotelList = document.getElementById('hotel-list')
  hotelList.innerHTML = '' // مسح العناصر السابقة

  hotels.forEach((hotel) => {
    const option = document.createElement('option')
    option.value = hotel
    hotelList.appendChild(option)
  })
}

// إظهار وإخفاء العناصر
function toggleVisibility(hideId, showId) {
  document.getElementById(hideId).classList.add('hidden')
  document.getElementById(showId).classList.remove('hidden')
}

// إعادة تعيين نموذج الحجز
function resetBookingForm() {
  document.getElementById('travel-date').value = ''
  document.getElementById('trip-type').value = ''
  document.getElementById('trip-time').value = ''
  document.getElementById('company-name').value = ''
  document.getElementById('hotel-name').value = ''
  document.getElementById('room-number').value = ''
  document.getElementById('adults').value = ''
  document.getElementById('children').value = ''
  document.getElementById('infants').value = ''
  document.getElementById('notes').value = ''
}

// الحصول على وقت Pick Up بناءً على الفندق ووقت الرحلة
function getPickUpTime(hotelName, tripTime) {
  const hotel = hotels.find((h) => h.name === hotelName)
  if (hotel) {
    // تحديد وقت ال Pick Up بناءً على وقت الرحلة
    if (tripTime === 'morning') {
      return hotel.pickUpTimes.morning
    } else if (tripTime === 'afternoon') {
      return hotel.pickUpTimes.afternoon
    } else {
      return hotel.pickUpTimes.evening
    }
  }
  return '' // في حال عدم وجود فندق
}

// تسجيل الخروج
document.getElementById('logout-btn').addEventListener('click', function () {
  toggleVisibility('welcome-container', 'login-container')
  localStorage.setItem('auth', false)
  alert('تم تسجيل الخروج بنجاح!')
})

// تحميل التقرير كملف CSV
function downloadReport() {
  let csvContent =
    'travelDate,tripType,tripTime,companyName,hotelName,roomNumber,adults,children,infants,notes\n'

  bookings.forEach((booking) => {
    const row = [
      booking.travelDate,
      booking.tripType,
      booking.tripTime,
      booking.companyName,
      booking.hotelName,
      booking.roomNumber,
      booking.adults,
      booking.children,
      booking.infants,
      booking.notes,
    ].join(',')

    csvContent += row + '\n'
  })

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'report.csv'
  link.click()
}

// طباعة التقرير
function printReport() {
  const reportContent = document.getElementById('report-container').innerHTML
  const printWindow = window.open('', '', 'height=600,width=800')
  printWindow.document.write('<html><head><title>تقرير</title></head><body>')
  printWindow.document.write(reportContent)
  printWindow.document.write('</body></html>')
  printWindow.document.close()
  printWindow.print()
}

window.onload = function () {
  if (isAuth) {
    document.getElementById('login-container').classList.add('hidden')
    document.getElementById('welcome-container').classList.remove('hidden')
  }
}