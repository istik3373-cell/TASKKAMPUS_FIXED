function uploadTugas(){

    const matkul =
    document.getElementById("matkul").value;

    const judul =
    document.getElementById("judul").value;

    const file =
    document.getElementById("file").value;

    if(
        matkul === "" ||
        judul === "" ||
        file === ""
    ){

        alert("Lengkapi semua data!");
        return;

    }

    let tugasBaru = {

        matkul: matkul,
        judul: judul,
        file: file,
        status: "Sudah Upload"

    };

    let dataTugas =
    JSON.parse(
    localStorage.getItem("tugas")
    ) || [];

    dataTugas.push(tugasBaru);

    localStorage.setItem(
    "tugas",
    JSON.stringify(dataTugas)
    );

    document.getElementById("pesan").innerHTML =
    "✅ Tugas berhasil diupload";

    document.getElementById("matkul").value = "";
    document.getElementById("judul").value = "";
    document.getElementById("file").value = "";

}