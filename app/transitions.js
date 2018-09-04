export default function(){
  this.transition(
    this.hasClass('transaction-alert'),
    this.toValue(true),
    this.use('toLeft'),
    this.reverse('toRight')
  );
}
