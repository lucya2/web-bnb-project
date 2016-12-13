function execDaumPostcode() {
    new daum.Postcode({
        oncomplete: function(data) {
            var fullAddr = ''; 
            var extraAddr = ''; 
            if (data.userSelectedType === 'R') {
                fullAddr = data.roadAddress;
            } else { 
                fullAddr = data.jibunAddress;
            }
            if(data.userSelectedType === 'R'){
                if(data.bname !== ''){
                    extraAddr += data.bname;
                }
                if(data.buildingName !== ''){
                    extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                }
                fullAddr += (extraAddr !== '' ? ' ('+ extraAddr +')' : '');
            }
            document.getElementById('postcode').value = data.zonecode; 
            document.getElementById('bigAddress').value = fullAddr;
            document.getElementById('smallAddress').focus();
        }
    }).open();
}
