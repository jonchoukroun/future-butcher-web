export default function(){
  this.transition(
    this.hasClass('transaction-alert'),
    this.toValue(true),
    this.use('toRight'),
    this.reverse('toRight')
  );
}
