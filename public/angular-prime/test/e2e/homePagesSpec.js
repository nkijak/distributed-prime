describe('Home Pages', function() {

  var ptor = protractor.getInstance();

  it('action buttons should be enabled correctly', function() {
    ptor.get('/#');  
    expect(ptor.findElement(protractor.By.id("action")).getAttribute("disabled")).toBeFalsy();
    expect(ptor.findElement(protractor.By.id("stop")).getAttribute("disabled"));
  });

  it('action buttons should toggle when started', function() {
    ptor.get('/#');  
    var goButton = ptor.findElement(protractor.By.id("action"));
    goButton.click();
    
    expect(goButton.getAttribute("disabled")).toBeTruthy();
    expect(ptor.findElement(protractor.By.id("stop")).getAttribute("disabled")).toBeFalsy();
  });

});
