let ActionCompleted = false;

$('#PurchaseModal').on('hidden.bs.modal', function ()
{
    $('#ProductSelection').val('');
    $('#PaymentSelection').val('');
    $('#SocialNetwork_Selection').val('');
    $('#Output').html('');
    ActionCompleted = false;
});
    
$(window).on('beforeunload', function()
{
        $('#ProductSelection').val('');
        $('#PaymentSelection').val('');
        $('#SocialNetwork_Selection').val('');
        $('#Output').html('');
        ActionCompleted = false;
});

$("#ProductSelection").on('input', function() 
{
    if(!(/^\d$/.test($(this).val())) || (parseInt($(this).val()) < 1 || parseInt($(this).val()) > 6))
        $(this).val('');
});

$("#PaymentSelection").on('input', function() 
{
    if(!(/^\d$/.test($(this).val())) || (parseInt($(this).val()) < 1 || parseInt($(this).val()) > 7))
        $(this).val('');
});

$("#SocialNetwork_Selection").on('input', function()
{
    if(!(/^\d$/.test($(this).val())) || (parseInt($(this).val()) < 1 || parseInt($(this).val()) > 3))
        $(this).val('');
});

document.querySelector('.btn-primary').addEventListener('click', function() 
{
    $("#PurchaseModal").modal("show");

    let Product_TextColor;
    let Payment_TextColor;
    let SocialNetwork_TextColor;
    let SocialNetwork_Link;

    function UpdateInfo() 
    {
        let ProductName, PaymentName, SocialNetwork_Name;

        switch($("#ProductSelection").val())
        {
            case "1": ProductName = "Демо рекордер"; break;
            case "2": ProductName = "Зомби сборка"; break;
            case "3": ProductName = "Фурион подписка на месяц"; break;
            case "4": ProductName = "Фурион подписка на два месяца"; break;
            case "5": ProductName = "Rage hns cfg by hpp forever"; break;
            case "6": ProductName = "Legit hns cfg by hpp forever"; break;
            default: ProductName = ""; break;
        }

        switch($("#PaymentSelection").val())
        {
            case "1": PaymentName = "Юмани кошелек"; break;
            case "2": PaymentName = "Через карту на юмани кошелек продавца по номеру телефона"; break;
            case "3": PaymentName = "SberPay"; break;
            case "4": PaymentName = "Карта СБП"; break;
            case "5": PaymentName = "Карта Мир"; break;
            case "6": PaymentName = "Карта Mastercard"; break;
            case "7": PaymentName = "Карта Тинькофф"; break;
            default: PaymentName = ""; break;
        }

        switch($("#SocialNetwork_Selection").val())
        {
            case "1":
            {
                SocialNetwork_Name = "Вконтакте"; 
                SocialNetwork_Link = "https://vk.com/im?media=&sel=661003834";
            }
            break;

            case "2":
            {
                SocialNetwork_Name = "Дискорд"; 
                SocialNetwork_Link = "https://discord.com/users/793057204529922060";
            } 
            break;

            case "3":
            {
                SocialNetwork_Name = "Телеграмм";
                SocialNetwork_Link = "https://t.me/HWDLL_0x12043CC";
            } 
            break;

            default: SocialNetwork_Name = ""; break;
        }

        Product_TextColor = $("#ProductSelection").val() === '' ? 'red' : 'green';
        Payment_TextColor = $("#PaymentSelection").val() === '' ? 'red' : 'green';
        SocialNetwork_TextColor = $("#SocialNetwork_Selection").val() === '' ? 'red' : 'green';

        $("#Output").html(`<p style="color: ${Product_TextColor}">Товар: ${ProductName} (ID: ${$("#ProductSelection").val()})</p><p style="color: ${Payment_TextColor}">Способ оплаты: ${PaymentName} (ID: ${$("#PaymentSelection").val()})</p><p style="color: ${SocialNetwork_TextColor}">Социальная сеть: ${SocialNetwork_Name} (ID: ${$("#SocialNetwork_Selection").val()})</p>`);
    }

    UpdateInfo();

    $("#ProductSelection").on('input', function() 
    {
        UpdateInfo();
    });

    $("#PaymentSelection").on('input', function() 
    {
        UpdateInfo();
    });

    $("#SocialNetwork_Selection").on('input', function() 
    {
        UpdateInfo();
    });

    document.getElementById("ConfirmPurchase").addEventListener('click', function() 
    {
        if (Product_TextColor == "green" && Payment_TextColor == "green" && SocialNetwork_TextColor == "green")
        {
            let BufferText = "Привет!\n\nХочу купить у тебя товар ";
    
            switch ($("#ProductSelection").val())
            {
                case "1": BufferText += "\"Демо рекордер\""; break;
                case "2": BufferText += "\"Зомби сборка\""; break;
                case "3": BufferText += "\"Фурион подписка на месяц\""; break;
                case "4": BufferText += "\"Фурион подписка на два месяца\""; break;
                case "5": BufferText += "\"Rage hns cfg by hpp forever\"";   break;
                case "6": BufferText += "\"Legit hns cfg by hpp forever\"";  break;
            }
    
            switch ($("#PaymentSelection").val()) 
            {
                case "1": BufferText += ", оплачивать буду через Юмани кошелек.\nСкинь номер кошелька"; break;
                case "2": BufferText += ", оплачивать буду через карту на твой Юмани кошелек по номеру телефона.\nСкинь номер телефона"; break;
                case "3": BufferText += ", оплачивать буду через твой хостинг (SberPay)\nСкинь ссылку"; break;
                case "4": BufferText += ", оплачивать буду через твой хостинг (СБП)\nСкинь ссылку"; break;
                case "5": BufferText += ", оплачивать буду через твой хостинг (Мир)\nСкинь ссылку"; break;
                case "6": BufferText += ", оплачивать буду через твой хостинг (Mastercard)\nСкинь ссылку"; break;
                case "7": BufferText += ", оплачивать буду через твой хостинг (Тинькофф)\nСкинь ссылку"; break;
            }

            navigator.clipboard.writeText(BufferText)
            
            .then(() => 
            {
                window.open(SocialNetwork_Link, "_blank");
            });
            
            if (!ActionCompleted)
                alert("Текст скопирован в буффер обмена, отправьте этот текст продавцу.\n\nПри закрытии этого окна - вас перекинет в личные сообщения с продавцом");

            ActionCompleted = true;
        }

        else
            alert("Вы ввели не все данные");
    });
});