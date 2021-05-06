

const steps =document.querySelector('.steps');
const $step = document.querySelectorAll('.sub--step');
const stepComplete ='.step--complete';

/*for (const _step of $step) {
  _step.addEventListener('click', ()=>{
      _step.classList.remove('step--incomplete');
      _step.classList.add('step--complete');
      _step.classList.remove('step--active');
      _step.classList.add('step--inactive');

      if(_step.classList.value.indexOf("step--inactive")!=-1){
        _step.addEventListener('click', ()=>{
          _step.addEventListener('click', ()=>{
            _step.classList.remove('step--complete');
            _step.classList.add('step--incomplete');
            _step.classList.remove('step--inactive');
            _step.classList.add('step--active');
            //if()
            if(_step.classList.value.indexOf("step--active")!=-1){
              _step.addEventListener('click', ()=>{
                _step.classList.remove('step--incomplete');
                _step.classList.add('step--complete');
                _step.classList.remove('step--active');
                _step.classList.add('step--inactive');
              });
            }
          })
          _step.before();
        });
      }
    });

  
}*/


function activationNode (){
  for (const _step of $step) { 
    _step.addEventListener('click', ()=>{
      _step.classList.remove('step--incomplete');
      _step.classList.add('step--complete');
      _step.classList.remove('step--active');
      _step.classList.add('step--inactive');
      if(_step.classList.value.indexOf("step--inactive")!=-1){
          downNode();
      }
    });

  }
}
function downNode(){
  for (const _step of $step) {
    _step.addEventListener('click', ()=>{
      _step.addEventListener('click', ()=>{
        _step.classList.remove('step--complete');
        _step.classList.add('step--incomplete');
        _step.classList.remove('step--inactive');
        _step.classList.add('step--active');
        if(_step.classList.value.indexOf("step--active")!=-1){
            activationNode();

        }
      })
    });
  }
}
activationNode();
