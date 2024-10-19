const UpdateCheat = document.getElementById('updateCheat');
const UpdateSite = document.getElementById('updateSite');
const CheatAccordion = document.getElementById('UpdateCheat');
const SiteUpdateText = document.getElementById('SiteUpdate');

UpdateCheat.addEventListener('change', () => 
{
    if (UpdateCheat.checked) 
    {
        CheatAccordion.style.display = 'block';
        SiteUpdateText.style.display = 'none';
    }
});

UpdateSite.addEventListener('change', () => 
{
    if (UpdateSite.checked) 
    {
        CheatAccordion.style.display = 'none';
        SiteUpdateText.style.display = 'block';
    }

    document.querySelectorAll('.accordion-button').forEach(btn => 
    {
        btn.classList.add('collapsed');
    });

    document.querySelectorAll('.accordion-collapse').forEach(item => 
    {
        item.classList.remove('show');
    });
});

window.onload = function() 
{
    UpdateCheat.checked = true;
    CheatAccordion.style.display = 'block';
    SiteUpdateText.style.display = 'none';
    UpdateSite.checked = false;
}

$('.accordion-header button').click(function() 
{
    $('.accordion-collapse').collapse('hide');
});
