let tugas =
JSON.parse(
localStorage.getItem("tugas")
) || [];

tampilkanTugas();

function tambahTugas(){

    const judul =
    document.getElementById("judul").value;

    const matkul =
    document.getElementById("matkul").value;

    const deadline =
    document.getElementById("deadline").value;

    if(
        judul === "" ||
        matkul === "" ||
        deadline === ""
    ){
        alert("Lengkapi data!");
        return;
    }

    tugas.push({
        judul,
        matkul,
        deadline
    });

    localStorage.setItem(
        "tugas",
        JSON.stringify(tugas)
    );

    document.getElementById("judul").value = "";
    document.getElementById("matkul").value = "";
    document.getElementById("deadline").value = "";

    tampilkanTugas();

}

function tampilkanTugas(){

    const tabel =
    document.getElementById("dataTugas");

    tabel.innerHTML = "";

    tugas.forEach((item,index)=>{

        tabel.innerHTML += `
        <tr>
            <td>${index+1}</td>
            <td>${item.judul}</td>
            <td>${item.matkul}</td>
            <td>${item.deadline}</td>
            <td>
                <button
                class="hapus"
                onclick="hapusTugas(${index})">
                Hapus
                </button>
            </td>
        </tr>
        `;

    });

}

function hapusTugas(index){

    tugas.splice(index,1);

    localStorage.setItem(
        "tugas",
        JSON.stringify(tugas)
    );

    tampilkanTugas();

}