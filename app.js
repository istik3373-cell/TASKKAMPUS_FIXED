
function showPage(page){
document.querySelectorAll('.page').forEach(p=>p.classList.add('hidden'));
document.getElementById(page).classList.remove('hidden');
}
