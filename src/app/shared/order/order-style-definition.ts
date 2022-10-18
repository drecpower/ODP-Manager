export class OrderStyleDefinition {

    public static readonly osd: any = {
        PLC: {
            statusGroup: "Pending",
            instruction: { label: "Confirm order", icon: "exclamation-circle" },
            buttons: [{ value: "requestCancellation", label: "Cancel", icon: "trash-alt" }, { value: "confirm", label: "Confirm", icon: "vote-yea" }],
            backgroundColor:"#fde7e69e",
            color:"#d10c0c"
        },
        CFM: {
            statusGroup: "In Preparation",
            instruction: {label:"Deliver until",icon:"check"},
            buttons: [{ value: "requestCancellation", label: "Cancelar", icon: "trash-alt" }, { value: "dispatch", label: "Despachar", icon: "motorcycle" }, { value: "readyToPickup", label: "Pronto para retirar", icon: "check" }],
            backgroundColor:"#ffe9bb4d",
            color:"#e99516"
        },
        RTP: {
            statusGroup: "Ready To Pickup",
            instruction: {label:"order ready",icon:"shopping-bag"},
            buttons: [{ value: "requestCancellation", label: "Cancelar", icon: "trash-alt" }, { value: "CON", label: "Concluir", icon: "check-circle" }],
            backgroundColor:"#c8efc847",
            color:"#09b509"
        },
        DSP: {
            statusGroup: "Dispatched",
            instruction: {label:"order sended",icon:"motorcycle"},
            buttons: [{ value: "requestCancellation", label: "Cancelar", icon: "trash-alt" }, { value: "CON", label: "Concluir", icon: "check-circle" }],
            backgroundColor:"#c8efc850",
            color:"#09b509"
        },
        CON: {
            statusGroup: "Concluded",
            instruction: {label:"order concluded",icon:"check"},
            buttons: [],
            backgroundColor:"lightgray",
            color:"gray"
        },
        CAN: {
            statusGroup: "Canceled",
            instruction: {label:"order canceled",icon:"times-circle"},
            buttons: [],
            backgroundColor:"lightgray",
            color:"gray"
        },
        OWO: {
            statusGroup: "Order with ocurrences",
            instruction: {label:"need attention",icon:"exclamation-circle"},
            buttons: [],
            backgroundColor:"red",
            color:"white"
        },
    };


}
