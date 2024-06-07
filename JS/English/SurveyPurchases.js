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
            case "1": ProductName = "Demo recorder"; break;
            case "2": ProductName = "Zombie build"; break;
            case "3": ProductName = "Furion hack monthly subscription"; break;
            case "4": ProductName = "Furion hack for two months subscription"; break;
            case "5": ProductName = "Rage hns cfg by hpp forever"; break;
            case "6": ProductName = "Legit hns cfg by hpp forever"; break;
            default: ProductName = ""; break;
        }

        switch($("#PaymentSelection").val())
        {
            case "1": PaymentName = "Yoomoney wallet"; break;
            case "2": PaymentName = "Через карту на юмани кошелек продавца по номеру телефона"; break;
            case "3": PaymentName = "SberPay"; break;
            case "4": PaymentName = "Card СБП"; break;
            case "5": PaymentName = "Card Мир"; break;
            case "6": PaymentName = "Card Mastercard"; break;
            case "7": PaymentName = "Card Тинькофф"; break;
            default: PaymentName = ""; break;
        }

        switch($("#SocialNetwork_Selection").val())
        {
            case "1":
            {
                SocialNetwork_Name = "Vkontakte"; 
                SocialNetwork_Link = "https://vk.com/im?media=&sel=661003834";
            }
            break;

            case "2":
            {
                SocialNetwork_Name = "Discord"; 
                SocialNetwork_Link = "https://discord.com/users/793057204529922060";
            } 
            break;

            case "3":
            {
                SocialNetwork_Name = "Telegram";
                SocialNetwork_Link = "https://t.me/HWDLL_0x12043CC";
            } 
            break;

            default: SocialNetwork_Name = ""; break;
        }

        Product_TextColor = $("#ProductSelection").val() === '' ? 'red' : 'green';
        Payment_TextColor = $("#PaymentSelection").val() === '' ? 'red' : 'green';
        SocialNetwork_TextColor = $("#SocialNetwork_Selection").val() === '' ? 'red' : 'green';

        $("#Output").html(`<p style="color: ${Product_TextColor}">Product: ${ProductName} (ID: ${$("#ProductSelection").val()})</p><p style="color: ${Payment_TextColor}">Method of payment: ${PaymentName} (ID: ${$("#PaymentSelection").val()})</p><p style="color: ${SocialNetwork_TextColor}">Social network: ${SocialNetwork_Name} (ID: ${$("#SocialNetwork_Selection").val()})</p>`);
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
            let BufferText = "Hello!\n\nI want to buy a product ";
    
            switch ($("#ProductSelection").val())
            {
                case "1": BufferText += "\"Demo recorder\""; break;
                case "2": BufferText += "\"Zombie build\""; break;
                case "3": BufferText += "\"Furion hack monthly subscription\""; break;
                case "4": BufferText += "\"Furion hack for two months subscription\""; break;
                case "5": BufferText += "\"Rage hns cfg by hpp forever\"";   break;
                case "6": BufferText += "\"Legit hns cfg by hpp forever\"";  break;
            }
    
            switch ($("#PaymentSelection").val()) 
            {
                case "1": BufferText += ", i'll pay through Yoomoney wallet.\nGive me the wallet number"; break;
                case "2": BufferText += ", i'll pay via card to your Yoomoney wallet by phone number.\nGive me your phone number"; break;
                case "3": BufferText += ", i'll pay through your hosting (SberPay)\nGive me the link"; break;
                case "4": BufferText += ", i'll pay through your hosting (СБП)\nGive me the link"; break;
                case "5": BufferText += ", i'll pay through your hosting (Мир)\nGive me the link"; break;
                case "6": BufferText += ", i'll pay through your hosting (Mastercard)\nGive me the link"; break;
                case "7": BufferText += ", i'll pay through your hosting (Тинькофф)\nGive me the link"; break;
            }

            navigator.clipboard.writeText(BufferText)
            
            .then(() => 
            {
                window.open(SocialNetwork_Link, "_blank");
            });
            
            if (!ActionCompleted)
                alert("The text is copied to the exchange buffer, send this text to the seller.\n\nWhen you close this window - you will be taken to private messages with the seller");

            ActionCompleted = true;
        }

        else
            alert("You have not entered all the data");
    });
});