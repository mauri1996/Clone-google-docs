const mongoose = require("mongoose")
const Document = require("./Document")

mongoose.connect("mongodb://localhost/google-docs-clone", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
})

const io = require("socket.io")(3001, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
})

const defaultValue = ""


io.on("connection", socket => {
    console.log(socket.rooms)
        // for (const room of socket.rooms) {
        //     socket.to(room).emit("clients-connect", io.engine.clientsCount);
        // }
    socket.on("disconnecting", (reason) => {
        for (const room of socket.rooms) {

            socket.to(room).emit("clients-disconnect", io.engine.clientsCount);

        }
    });


    socket.on("get-document", async(documentId, nameUser) => {
        const document = await findOrCreateDocument(documentId)

        socket.join(documentId)

        socket.emit("load-document", document.data)

        socket.on("send-changes", delta => {
            socket.broadcast.to(documentId).emit("receive-changes", delta)
        })

        socket.on("save-document", async data => {
            await Document.findByIdAndUpdate(documentId, { data })
        })
        socket.broadcast.to(documentId).emit("clients-connect", io.engine.clientsCount)


    })
})

async function findOrCreateDocument(id) {
    if (id == null) return

    const document = await Document.findById(id)
    if (document) return document
    return await Document.create({ _id: id, data: defaultValue })

}